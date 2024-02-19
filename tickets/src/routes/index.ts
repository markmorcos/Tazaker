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
    const { eventId } = req.query;

    const tickets = await Ticket.find({ eventId, orderId: null });

    res.send(tickets);
  }
);

export { router as indexTicketRouter };
