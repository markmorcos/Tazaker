import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { OrderStatus } from "@tazaker/common";

export interface OrderAttrs {
  id: string;
  userId: string;
  ticket: {
    id: string;
    userId: string;
    price: number;
  };
  eventEnd: Date;
  status: OrderStatus;
  version: number;
}

type OrderDoc = Document & Omit<OrderAttrs, "id" | "version">;

interface OrderModel extends Model<OrderDoc> {
  build: (order: OrderAttrs) => OrderDoc;
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<OrderDoc | null>;
}

export interface OrderPayload {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
}

const orderSchema: Schema<OrderDoc> = new Schema(
  {
    userId: { type: String, required: true },
    ticket: {
      id: { type: String, required: true },
      userId: { type: String, required: true },
      price: { type: Number, required: true },
    },
    eventEnd: { type: Schema.Types.Date, required: true },
    status: { type: String, enum: Object.values(OrderStatus), required: true },
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

orderSchema.statics.build = ({ id: _id, ...attrs }: OrderAttrs) => {
  return new Order({ _id, ...attrs });
};
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({ _id: event.id, version: event.version - 1 });
};

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export const Order = model<OrderDoc, OrderModel>("Order", orderSchema);
