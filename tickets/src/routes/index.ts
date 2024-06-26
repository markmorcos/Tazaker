import express, { Request, Response } from "express";
import { query } from "express-validator";

import { validateRequest } from "@tazaker/common";

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

export { router as indexTicketRouter };
