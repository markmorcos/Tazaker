import express, { Request, Response } from "express";

import { BadRequestError, requireAuth } from "@tazaker/common";

import { Wallet } from "../models/wallet";
import * as paypal from "../paypal";

const router = express.Router();

router.post(
  "/api/payouts",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const balance = await Wallet.balance(userId);

    if (balance == 0) {
      throw new BadRequestError("Cannot send payout");
    }

    await paypal.initiatePayout(balance, req.currentUser!.paypalEmail);

    const payout = Wallet.build({ userId, amount: -balance });
    await payout.save();

    res.status(200).send({ success: true });
  }
);

export { router as createPayoutRouter };
