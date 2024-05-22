import express, { Request, Response } from "express";

import { BadRequestError, requireAuth } from "@tazaker/common";

import { Wallet } from "../models/wallet";
import * as paypal from "../paypal";

const router = express.Router();

router.get("/api/payouts", requireAuth, async (req: Request, res: Response) => {
  let wallet;

  wallet = await Wallet.findOne({ userId: req.currentUser!.id });
  if (!wallet) {
    wallet = Wallet.build({ userId: req.currentUser!.id, balance: 0 });
    await wallet.save();
  }

  res.status(200).send(wallet);
});

export { router as readPayoutRouter };
