import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { OrderStatus } from "@tazaker/common";

import { EventDoc } from "./event";
import { Order, OrderDoc } from "./order";
import { UserDoc } from "./user";

export interface TicketAttrs {
  id: string;
  user: UserDoc;
  event: EventDoc;
  price: number;
}

export type TicketDoc = Document &
  TicketAttrs & {
    findOrderByStatus: (status: OrderStatus) => Promise<OrderDoc | null>;
    fees: number;
    total: number;
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
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    price: { type: Number, required: true },
  },
  {
    virtuals: {
      fees: {
        get: function () {
          return Math.round(100 * (this.price * 0.05 + 0.5)) / 100;
        },
      },
      total: {
        get: function () {
          return this.price + this.fees;
        },
      },
    },
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      virtuals: true,
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, ...attrs });
};
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};
ticketSchema.methods.findOrderByStatus = async function (status: OrderStatus) {
  return Order.findOne({ ticket: this, status });
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
