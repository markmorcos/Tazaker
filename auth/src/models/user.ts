import { Document, Model, Schema, model } from "mongoose";

export interface UserAttrs {
  email: string;
  paypalEmail?: string;
  code: string;
}

type UserDoc = Document & UserAttrs;

interface UserModel extends Model<UserDoc> {
  createIfNotExists: (user: Partial<UserAttrs>) => UserDoc;
}

const userSchema: Schema<UserDoc> = new Schema(
  {
    email: { type: String, required: true },
    paypalEmail: { type: String },
    code: { type: String },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.code;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (!this.paypalEmail) {
    this.set("paypalEmail", this.email);
  }

  done();
});

userSchema.statics.createIfNotExists = async (attrs: Partial<UserAttrs>) => {
  let user = await User.findOne({ email: attrs.email });
  if (!user) {
    user = new User(attrs);
  }

  user.set({ code: attrs.code });
  await user.save();

  return user;
};

export const User = model<UserDoc, UserModel>("User", userSchema);
