import { Document, Model, Schema, model } from "mongoose";

import { OrderDoc } from "./order";

export interface PaymentAttrs {
  order: OrderDoc;
  paypalOrderId: string;
}

type PaymentDoc = Document & PaymentAttrs;

interface PaymentModel extends Model<PaymentDoc> {
  build: (payment: PaymentAttrs) => PaymentDoc;
}

export interface PaymentPayload {
  orderId: string;
}

const paymentSchema: Schema<PaymentDoc> = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    paypalOrderId: { type: String, required: true },
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

export const Payment = model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
