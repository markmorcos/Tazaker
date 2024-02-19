import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { Event } from "../models/event";
import { nats } from "../nats";
import { EventCreatedPublisher } from "../events/publishers/event-created-publisher";

const router = express.Router();

router.post(
  "/api/events",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("url").notEmpty().withMessage("URL is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
    body("endTime").notEmpty().withMessage("End time is required"),
    body("timezone").notEmpty().withMessage("Timezone is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (req.currentUser?.email !== "mark.yehia@gmail.com") {
      throw new NotAuthorizedError();
    }

    const { body } = req;
    const {
      title,
      url,
      image,
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
    } = body;

    const event = await Event.build({
      title,
      url,
      image,
      start: new Date(`${startDate}T${startTime}Z`),
      end: new Date(`${endDate}T${endTime}Z`),
      timezone,
    });
    await event.save();

    await new EventCreatedPublisher(nats.client).publish({
      id: event.id,
      title: event.title,
      url: event.url,
      image: event.image,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      timezone: event.timezone,
      version: event.version,
    });

    res.status(201).send(event);
  }
);

export { router as createEventRouter };
