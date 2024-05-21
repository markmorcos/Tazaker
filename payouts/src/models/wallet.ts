import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface WalletAttrs {
  userId: string;
  balance: number;
}

type WalletDoc = Document & WalletAttrs & { version: number };

export interface WalletModel extends Model<WalletDoc> {
  build: (wallet: WalletAttrs) => WalletDoc;
}

export interface WalletPayload {
  id: string;
  userId: string;
  balance: number;
}

const walletSchema: Schema<WalletDoc> = new Schema(
  {
    userId: { type: String, required: true },
    balance: { type: Number, required: true },
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

walletSchema.statics.build = (attrs: WalletAttrs) => {
  return new Wallet(attrs);
};

walletSchema.set("versionKey", "version");
walletSchema.plugin(updateIfCurrentPlugin);

export const Wallet = model<WalletDoc, WalletModel>("Wallet", walletSchema);
