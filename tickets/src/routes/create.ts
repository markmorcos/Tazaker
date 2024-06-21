import express, { Request, Response } from "express";
import { mongo, connection } from "mongoose";
import { body } from "express-validator";
import multer from "multer";
import { PassThrough } from "stream";

import { BadRequestError, requireAuth, validateRequest } from "@tazaker/common";

import { Ticket } from "../models/ticket";
import { nats } from "../nats";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

const router = express.Router();

const uploadFile = (file: Express.Multer.File): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const bucket = new mongo.GridFSBucket(connection.db);
      const uploadStream = bucket.openUploadStream(file.originalname);

      const readStream = new PassThrough();
      readStream.end(file.buffer);
      readStream.pipe(uploadStream);

      uploadStream.on("error", reject);
      uploadStream.on("finish", () => resolve(uploadStream.id.toHexString()));
    } catch (error) {
      reject("Error uploading file");
    }
  });

router.post(
  "/api/tickets",
  requireAuth,
  upload.single("file"),
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

    if (!req.file) {
      throw new BadRequestError("A PDF ticket must be uploaded");
    }

    let fileId: string;

    try {
      fileId = await uploadFile(req.file);
    } catch (error) {
      throw new BadRequestError("Could not upload ticket");
    }

    const ticket = Ticket.build({ userId, eventId, price, fileId });
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
