import express, { Request, Response } from "express";

import { BadRequestError, requireAuth } from "@tazaker/common";

import { Wallet } from "../models/wallet";
import * as paypal from "../paypal";

const router = express.Router();

router.post(
  "/api/payouts",
  requireAuth,
  async (req: Request, res: Response) => {
    const wallet = await Wallet.findOne({ userId: req.currentUser!.id });
    if (!wallet || wallet.balance <= 0) {
      throw new BadRequestError("Cannot send payout");
    }

    await paypal.initiatePayout(wallet.balance, req.currentUser!.paypalEmail);

    res.status(200).send({});
  }
);

export { router as createPayoutRouter };
