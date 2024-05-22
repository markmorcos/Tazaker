import express, { Request, Response } from "express";
import { body } from "express-validator";
import { sign } from "jsonwebtoken";

import {
  NotFoundError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { User } from "../models/user";

const router = express.Router();

router.patch(
  "/api/auth",
  [body("paypalEmail").isEmail()],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    const { paypalEmail } = req.body;
    user.set("paypalEmail", paypalEmail);
    await user.save();

    req.session!.jwt = sign(
      { id: user.id, email: user.email, paypalEmail: user.paypalEmail },
      process.env.JWT_KEY!
    );

    return res.status(204).send(user);
  }
);

export { router as updateAuthRouter };
