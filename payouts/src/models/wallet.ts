import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface WalletAttrs {
  userId: string;
  amount: number;
}

type WalletDoc = Document & WalletAttrs & { version: number };

export interface WalletModel extends Model<WalletDoc> {
  build: (wallet: WalletAttrs) => WalletDoc;
  balance: (userId: string) => Promise<number>;
}

export interface WalletPayload {
  id: string;
  userId: string;
  amount: number;
}

const walletSchema: Schema<WalletDoc> = new Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
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

walletSchema.statics.balance = async (userId: string) => {
  const aggregatedAmount = await Wallet.aggregate([
    { $match: { userId } },
    { $group: { _id: null, amount: { $sum: "$amount" } } },
  ]);
  const balance = aggregatedAmount[0]?.amount || 0;

  return balance;
};

walletSchema.set("versionKey", "version");
walletSchema.plugin(updateIfCurrentPlugin);

export const Wallet = model<WalletDoc, WalletModel>("Wallet", walletSchema);
