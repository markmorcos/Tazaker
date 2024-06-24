import express, { Request, Response } from "express";

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  NotificationType,
  OrderStatus,
  requireAuth,
} from "@tazaker/common";

import { nats } from "../nats";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { NotificationPublisher } from "../events/publishers/notification-publisher";

const router = express.Router();

router.post("/api/payments", async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    throw new BadRequestError("Missing Stripe signature");
  }

  const stripeEvent = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (stripeEvent.type !== "checkout.session.completed") {
    return res.send({});
  }

  const orderId = stripeEvent.data.object.client_reference_id;
  if (!orderId) {
    throw new BadRequestError("Missing order ID");
  }

  const order = await Order.findById(orderId)
    .populate("ticket")
    .populate({ path: "ticket", populate: { path: "user" } })
    .populate({ path: "ticket", populate: { path: "event" } });
  if (!order) {
    throw new NotFoundError();
  }

  const ticket = order.ticket;
  const event = ticket.event;

  const userId = stripeEvent.data.object.metadata?.userId;
  if (userId !== order.userId) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Expired) {
    throw new BadRequestError("Cannot pay for an expired order");
  }

  if (new Date() > event.end) {
    throw new BadRequestError("Event has already ended");
  }

  const payment = Payment.build({ orderId });
  await payment.save();

  await new PaymentCreatedPublisher(nats.client).publish({
    id: payment.id,
    orderId: payment.orderId,
  });

  await new NotificationPublisher(nats.client).publish({
    email: ticket.user.email,
    type: NotificationType.Sale,
    payload: {
      eventTitle: event.title,
      eventUrl: event.url,
      price: ticket.price,
    },
  });

  res.status(201).send(payment);
});

export { router as createPaymentRouter };
