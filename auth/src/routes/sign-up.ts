import express, { Request, Response } from "express";
import { body } from "express-validator";
import { randomBytes } from "crypto";

import { NotificationType, baseURL, validateRequest } from "@tazaker/common";

import { nats } from "../nats";
import { NotificationPublisher } from "../events/publishers/notification-publisher";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/auth/sign-up",
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const code = randomBytes(16).toString("hex");
    const user = await User.createIfNotExists({ email, code });

    await new NotificationPublisher(nats.client).publish({
      type: NotificationType.Auth,
      email,
      payload: {
        url: `${baseURL}/api/auth/complete?email=${email}&code=${code}`,
      },
    });

    res.status(200).send(user);
  }
);

export { router as signUpRouter };
