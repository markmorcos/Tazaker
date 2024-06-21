import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { OrderDoc } from "./order";

export interface TicketAttrs {
  userId: string;
  eventId: string;
  price: number;
  fileId: string;
  order?: OrderDoc;
}

export type TicketDoc = Document & TicketAttrs & { version: number };

interface TicketModel extends Model<TicketDoc> {
  build: (ticket: TicketAttrs) => TicketDoc;
}

export interface TicketPayload {
  id: string;
  userId: string;
  price: number;
  fileId: string;
}

const ticketSchema: Schema<TicketDoc> = new Schema(
  {
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    price: { type: Number, required: true },
    fileId: { type: String, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
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
  return new Ticket(attrs);
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
