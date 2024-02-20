import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { nats } from "../nats";
import * as paypal from "../paypal";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("orderId")
      .notEmpty()
      .isMongoId()
      .withMessage("Order ID must be provided"),
    body("paypalOrderId")
      .notEmpty()
      .withMessage("PayPal Order ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, paypalOrderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Expired) {
      throw new BadRequestError("Cannot pay for an expired order");
    }

    if (new Date() > order.eventEnd) {
      throw new BadRequestError("Event has already ended");
    }

    const payment = Payment.build({ orderId, paypalOrderId });
    await payment.save();

    await paypal.captureOrder(paypalOrderId);

    await new PaymentCreatedPublisher(nats.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      paypalOrderId: payment.paypalOrderId,
    });

    res.status(201).send(payment);
  }
);

export { router as createPaymentRouter };
