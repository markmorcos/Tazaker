import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  BadRequestError,
  baseURL,
  NotAuthorizedError,
  NotFoundError,
  NotificationType,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { nats } from "../nats";
import { captureOrder } from "../paypal";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { NotificationPublisher } from "../events/publishers/notification-publisher";

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

    const order = await Order.findById(orderId)
      .populate("ticket")
      .populate({ path: "ticket", populate: { path: "user" } })
      .populate({ path: "ticket", populate: { path: "event" } });

    if (!order) {
      throw new NotFoundError();
    }

    const ticket = order.ticket;
    const event = ticket.event;

    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Expired) {
      throw new BadRequestError("Cannot pay for an expired order");
    }

    if (new Date() > event.end) {
      throw new BadRequestError("Event has already ended");
    }

    await captureOrder(paypalOrderId);

    const payment = Payment.build({ orderId, paypalOrderId });
    await payment.save();

    await captureOrder(paypalOrderId);

    await new PaymentCreatedPublisher(nats.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      paypalOrderId: payment.paypalOrderId,
    });

    await new NotificationPublisher(nats.client).publish({
      email: ticket.user.email,
      type: NotificationType.Sale,
      payload: {
        eventTitle: event.title,
        eventUrl: `${baseURL}/events/${event.id}`,
        price: ticket.price,
      },
    });

    res.status(201).send(payment);
  }
);

export { router as createPaymentRouter };
