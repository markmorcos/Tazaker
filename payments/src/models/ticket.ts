import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { EventDoc } from "./event";
import { UserDoc } from "./user";

export interface TicketAttrs {
  id: string;
  user: UserDoc;
  event: EventDoc;
  price: number;
}

export type TicketDoc = Document &
  TicketAttrs & {
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
