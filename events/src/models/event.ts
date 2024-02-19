import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface EventAttrs {
  title: string;
  url: string;
  image: string;
  start: Date;
  end: Date;
  timezone: string;
}

type EventDoc = Document & EventAttrs & { version: number };

interface EventModel extends Model<EventDoc> {
  build: (event: EventAttrs) => EventDoc;
}

export interface EventPayload {
  id: string;
  title: string;
  url: string;
  image: string;
  start: string;
  end: string;
  timezone: string;
}

const eventSchema: Schema<EventDoc> = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    image: { type: String, required: true },
    start: { type: Schema.Types.Date, required: true },
    end: { type: Schema.Types.Date, required: true },
    timezone: { type: String, required: true },
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

eventSchema.statics.build = (attrs: EventAttrs) => {
  return new Event(attrs);
};

eventSchema.set("versionKey", "version");
eventSchema.plugin(updateIfCurrentPlugin);

export const Event = model<EventDoc, EventModel>("Event", eventSchema);
