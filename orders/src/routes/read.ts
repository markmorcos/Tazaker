import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Stripe } from "stripe";

import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  baseURL,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { nats } from "../nats";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { OrderExpiredPublisher } from "../events/publishers/order-expired-publisher";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;

    const order = await Order.findById(req.params.id)
      .populate("ticket")
      .populate({ path: "ticket", populate: { path: "user" } })
      .populate({ path: "ticket", populate: { path: "event" } });

    if (!order) {
      throw new NotFoundError();
    }

    if (userId !== order.userId) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Complete) {
      return res.status(200).send(order);
    }

    const ticket = order.ticket;

    let session: Stripe.Checkout.Session;
    if (order.sessionId) {
      session = await stripe.checkout.sessions.retrieve(order.sessionId!, {
        stripeAccount: ticket.user.stripeAccountId,
      });
    } else {
      session = await stripe.checkout.sessions.create(
        {
          client_reference_id: order.id,
          metadata: { userId },
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: { name: ticket.event.title },
                unit_amount: ticket.price * 100,
              },
              quantity: 1,
            },
          ],
          payment_intent_data: { application_fee_amount: ticket.price },
          mode: "payment",
          ui_mode: "embedded",
          return_url: `${baseURL}/orders/${order.id}`,
        },
        { stripeAccount: ticket.user.stripeAccountId }
      );
    }
    order.set("sessionId", session.id);
    await order.save();

    if (session.status === "expired") {
      await new OrderExpiredPublisher(nats.client).publish({
        id: order.id,
        ticketId: order.ticket.id,
        version: order.version,
      });
      return res.status(200).send(order);
    }

    res
      .status(200)
      .send({ ...order.toJSON(), clientSecret: session.client_secret });
  }
);

export { router as readOrderRouter };
