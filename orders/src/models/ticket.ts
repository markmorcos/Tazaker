import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { OrderStatus } from "@tazaker/common";

import { EventDoc } from "./event";
import { Order, OrderDoc } from "./order";

export interface TicketAttrs {
  id: string;
  event: EventDoc;
  price: number;
}

export type TicketDoc = Document &
  TicketAttrs & {
    findOrderByStatuses: (
      status: OrderStatus | OrderStatus[]
    ) => Promise<OrderDoc | null>;
    version: number;
  };

interface TicketModel extends Model<TicketDoc> {
  build: (ticket: TicketAttrs) => TicketDoc;
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<TicketDoc | null>;
}

export interface TicketPayload {
  id: string;
  eventId: string;
  price: number;
}

const ticketSchema: Schema<TicketDoc> = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    price: { type: Number, required: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, ...attrs });
};
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

ticketSchema.methods.findOrderByStatuses = async function (
  status: OrderStatus | OrderStatus[]
) {
  return Order.findOne({
    ticket: this,
    status: { $in: Array.isArray(status) ? status : [status] },
  });
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
