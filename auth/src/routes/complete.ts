import express, { Request, Response } from "express";
import { query } from "express-validator";
import { sign } from "jsonwebtoken";

import { validateRequest } from "@tazaker/common";

import { nats } from "../nats";
import { User } from "../models/user";
import { UserUpdatedPublisher } from "../events/publishers/user-created-publisher";

const router = express.Router();

router.get(
  "/api/auth/complete",
  [query("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, code } = req.query;

    const user = await User.findOne({
      email: decodeURIComponent(String(email)),
      code,
    });
    if (!user) {
      return res.send("Invalid sign in link");
    }

    user.set({ code: undefined });
    await user.save();

    req.session!.jwt = sign(
      { id: user.id, email: user.email, paypalEmail: user.paypalEmail },
      process.env.JWT_KEY!
    );

    res.redirect("/");
  }
);

export { router as completeRouter };
