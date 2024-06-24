import express, { Request, Response } from "express";

import { NotFoundError, validateRequest } from "@tazaker/common";

import { Event } from "../models/event";
import { param } from "express-validator";

const router = express.Router();

router.get(
  "/api/events/:id",
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      throw new NotFoundError();
    }

    res.status(200).send(event);
  }
);

export { router as readEventRouter };
