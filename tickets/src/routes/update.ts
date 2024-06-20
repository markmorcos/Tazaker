import express, { Request, Response } from "express";
import { body, param } from "express-validator";

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { nats } from "../nats";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    param("id").isMongoId(),
    body("price")
      .notEmpty()
      .isCurrency({ allow_negatives: false })
      .withMessage("Price must be a valid non-negative number"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }

    if (ticket.order) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    const { price } = req.body;
    ticket.set({ price });
    await ticket.save();

    await new TicketUpdatedPublisher(nats.client).publish({
      id: ticket.id,
      price: ticket.price,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
