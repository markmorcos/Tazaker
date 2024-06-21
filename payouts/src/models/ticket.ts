import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface TicketAttrs {
  id: string;
  userId: string;
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
    userId: { type: String, required: true },
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
