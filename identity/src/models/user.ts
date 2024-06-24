import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface UserAttrs {
  email: string;
  stripeAccountId?: string;
  code: string;
}

type UserDoc = Document & UserAttrs & { version: number };

interface UserModel extends Model<UserDoc> {
  createIfNotExists: (user: Partial<UserAttrs>) => {
    isNewUser: boolean;
    user: UserDoc;
  };
}

const userSchema: Schema<UserDoc> = new Schema(
  {
    email: { type: String, required: true },
    stripeAccountId: { type: String },
    code: { type: String },
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

userSchema.statics.createIfNotExists = async (attrs: Partial<UserAttrs>) => {
  const { email, code } = attrs;

  let isNewUser = false;
  let user = await User.findOne({ email });
  if (!user) {
    isNewUser = true;
    user = new User(attrs);
  }

  user.set("code", code);
  await user.save();

  return { isNewUser, user };
};
userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

export const User = model<UserDoc, UserModel>("User", userSchema);
