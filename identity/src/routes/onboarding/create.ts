import express, { Request, Response } from "express";
import { body } from "express-validator";
import { sign } from "jsonwebtoken";

import {
  NotFoundError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { nats } from "../../nats";
import { stripe } from "../../stripe";
import { User } from "../../models/user";
import { UserUpdatedPublisher } from "../../events/publishers/user-updated-publisher";

const router = express.Router();

router.post(
  "/api/onboarding/account",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    let account;
    if (user.stripeAccountId) {
      try {
        account = await stripe.accounts.retrieve(user.stripeAccountId);
      } catch (error) {
        account = await stripe.accounts.create({});
      }
    } else {
      account = await stripe.accounts.create({});
      user.stripeAccountId = account.id;
      await user.save();
    }

    if (req.currentUser!.stripeAccountId !== user.stripeAccountId) {
      req.session!.jwt = sign(
        {
          id: user.id,
          email: user.email,
          stripeAccountId: user.stripeAccountId,
        },
        process.env.JWT_KEY!
      );

      await new UserUpdatedPublisher(nats.client).publish({
        id: user.id,
        stripeAccountId: user.stripeAccountId!,
        version: user.version,
      });
    }

    return res.status(201).send(account);
  }
);

router.delete(
  "/api/onboarding/account",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    if (user.stripeAccountId) {
      await stripe.accounts.del(user.stripeAccountId);
      user.stripeAccountId = undefined;
      await user.save();

      req.session!.jwt = sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!
      );

      await new UserUpdatedPublisher(nats.client).publish({
        id: user.id,
        stripeAccountId: undefined,
        version: user.version,
      });
    }

    return res.status(200).send({});
  }
);

router.post(
  "/api/onboarding/session",
  currentUser,
  requireAuth,
  [body("account").notEmpty().withMessage("Account ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { account } = req.body;

    const accountSession = await stripe.accountSessions.create({
      account: account,
      components: {
        account_onboarding: { enabled: true },
        account_management: { enabled: true },
        notification_banner: { enabled: true },
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
            external_account_collection: true,
          },
        },
      },
    });

    res.status(200).send(accountSession);
  }
);

export { router as onboardingRouter };
