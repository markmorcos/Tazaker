import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface UserAttrs {
  id: string;
  email: string;
  stripeAccountId?: string;
}

export type UserDoc = Document & UserAttrs;

interface UserModel extends Model<UserDoc> {
  build: (user: Partial<UserAttrs>) => UserDoc;
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<UserDoc | null>;
}

const userSchema: Schema<UserDoc> = new Schema(
  {
    email: { type: String, required: true },
    stripeAccountId: { type: String },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.code;
      },
    },
  }
);

userSchema.statics.build = (attrs: Partial<UserAttrs>) => {
  return new User({ _id: attrs.id, ...attrs });
};
userSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne(
    { _id: event.id, version: { $lte: event.version } },
    null,
    { sort: { version: -1 } }
  );
};
userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

export const User = model<UserDoc, UserModel>("User", userSchema);
