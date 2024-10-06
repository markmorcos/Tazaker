import express, { Request, Response } from "express";
import { query } from "express-validator";

import { requireAuth, validateRequest } from "@tazaker/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets",
  [query("eventId").isMongoId().withMessage("Event ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
      eventId: String(req.query.eventId),
      order: null,
    });

    res.status(200).send(tickets);
  }
);

router.get(
  "/api/tickets/listings",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;

    const tickets = await Ticket.find({ userId });

    res.status(200).send(tickets);
  }
);

export { router as indexTicketRouter };
