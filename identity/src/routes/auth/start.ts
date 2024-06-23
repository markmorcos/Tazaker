import express, { Request, Response } from "express";
import { body } from "express-validator";
import { randomBytes } from "crypto";

import { NotificationType, baseURL, validateRequest } from "@tazaker/common";

import { nats } from "../../nats";
import { User } from "../../models/user";
import { NotificationPublisher } from "../../events/publishers/notification-publisher";
import { UserCreatedPublisher } from "../../events/publishers/user-created-publisher";

const router = express.Router();

router.post(
  "/api/auth/start",
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const code = randomBytes(16).toString("hex");
    const { isNewUser, user } = await User.createIfNotExists({ email, code });

    await new NotificationPublisher(nats.client).publish({
      type: NotificationType.Auth,
      email,
      payload: {
        url: `${baseURL}/api/auth/complete?email=${encodeURIComponent(
          email
        )}&code=${code}`,
      },
    });

    if (isNewUser) {
      await new UserCreatedPublisher(nats.client).publish({
        id: user.id,
        email: user.email,
        version: user.version,
      });
    }

    res.status(200).send(user);
  }
);

export { router as startRouter };
