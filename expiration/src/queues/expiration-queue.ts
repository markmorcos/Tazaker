import Queue from "bull";

import { Subjects } from "@tazaker/common";

import { nats } from "../nats";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>(Subjects.ExpirationComplete, {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(nats.client).publish({
    orderId: job.data.orderId,
  });
  console.log("Job:", job.data.orderId);
});
