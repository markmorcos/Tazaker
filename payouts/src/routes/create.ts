import express, { Request, Response } from "express";

import {
  BadRequestError,
  NotificationType,
  requireAuth,
} from "@tazaker/common";

import { Wallet } from "../models/wallet";
import * as paypal from "../paypal";
import { nats } from "../nats";
import { NotificationPublisher } from "../events/publishers/notification-publisher";

const router = express.Router();

router.post(
  "/api/payouts",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id: userId, email, paypalEmail } = req.currentUser!;
    if (!paypalEmail) {
      throw new BadRequestError("Paypal email not found");
    }

    const balance = await Wallet.balance(userId);
    if (balance === 0) {
      throw new BadRequestError("Cannot send payout");
    }

    await paypal.initiatePayout(balance, paypalEmail);

    const payout = Wallet.build({ userId, amount: -balance });
    await payout.save();

    await new NotificationPublisher(nats.client).publish({
      type: NotificationType.Payout,
      email,
      payload: { amount: balance },
    });
    res.status(200).send({ success: true });
  }
);

export { router as createPayoutRouter };
