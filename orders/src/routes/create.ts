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
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { createOrder } from "../paypal";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
  "api/orders/paypal",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .isMongoId()
      .withMessage("Ticket ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const paypalOrder = await createOrder(ticket.price.toFixed(2));

    return res.status(201).send(paypalOrder);
  }
);

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

    await new OrderCreatedPublisher(nats.client).publish({
      id: order.id,
      userId: order.userId,
      ticketId: order.ticket.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
