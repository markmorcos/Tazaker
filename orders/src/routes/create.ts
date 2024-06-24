import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { nats } from "../nats";
import { stripe } from "../stripe";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .isMongoId()
      .withMessage("Ticket ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId)
      .populate("user")
      .populate("event");
    if (!ticket) {
      throw new NotFoundError();
    }
    if (!ticket.user.stripeAccountId) {
      throw new BadRequestError("Seller is not connected to Stripe");
    }
    if (new Date() > ticket.event.end) {
      throw new BadRequestError("Event has already ended");
    }

    const reservedOrder = await ticket.findOrderByStatus(OrderStatus.Created);
    if (!!reservedOrder && reservedOrder.userId === userId) {
      return res.status(200).send(reservedOrder);
    }
    if (!!reservedOrder) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const existingOrder = await ticket.findOrderByStatus(OrderStatus.Complete);
    if (!!existingOrder && existingOrder.userId === userId) {
      return res.status(200).send(existingOrder);
    }
    if (!!existingOrder) {
      throw new BadRequestError("Order belongs to someone else");
    }

    const existingOrders = await Order.find({
      userId,
      ticket: {
        $in: await Ticket.find({ id: { $ne: ticket.id }, event: ticket.event }),
      },
      status: OrderStatus.Created,
    });
    if (existingOrders.length > 0) {
      throw new BadRequestError(
        "Please complete the existing order to this event first or wait until it expires"
      );
    }

    const status = OrderStatus.Created;
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({ userId, ticket, expiresAt, status });
    await order.save();

    const session = await stripe.checkout.sessions.create(
      {
        client_reference_id: order.id,
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
        return_url: `/orders/${order.id}`,
      },
      { stripeAccount: ticket.user.stripeAccountId }
    );

    await new OrderCreatedPublisher(nats.client).publish({
      id: order.id,
      userId: order.userId,
      ticketId: order.ticket.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
    });

    res
      .status(201)
      .send({ ...order.toJSON(), clientSecret: session.client_secret });
  }
);

export { router as createOrderRouter };
