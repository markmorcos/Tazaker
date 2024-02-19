import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@tazaker/common";

import { Ticket } from "../models/ticket";
import { nats } from "../nats";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("eventId").isMongoId().withMessage("Event ID is required"),
    body("price")
      .notEmpty()
      .isCurrency({ allow_negatives: false })
      .withMessage("Price must be a valid non-negative number"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;
    const { eventId, price } = req.body;

    const ticket = await Ticket.build({ userId, eventId, price });
    await ticket.save();

    await new TicketCreatedPublisher(nats.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      price: ticket.price,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
