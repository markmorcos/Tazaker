import mongoose from "mongoose";

import { DatabaseConnectionError } from "@tazaker/common";

import { app } from "./app";
import { nats } from "./nats";
import { EventCreatedListener } from "./events/listeners/event-created-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderExpiredListener } from "./events/listeners/order-expired-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { UserCreatedListener } from "./events/listeners/user-created-listener";

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.STRIPE_SECRET) {
    throw new Error("STRIPE_SECRET must be defined");
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET must be defined");
  }

  try {
    await nats.connect(
      process.env.NATS_CLIENT_ID,
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_URL
    );
    nats.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => nats.client.close());
    process.on("SIGTERM", () => nats.client.close());

    new EventCreatedListener(nats.client).listen();
    new OrderCreatedListener(nats.client).listen();
    new OrderExpiredListener(nats.client).listen();
    new TicketCreatedListener(nats.client).listen();
    new TicketUpdatedListener(nats.client).listen();
    new UserCreatedListener(nats.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
