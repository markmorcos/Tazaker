import { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface EventAttrs {
  id: string;
  title: string;
  url: string;
  end: Date;
}

export type EventDoc = Document & EventAttrs & { version: number };

interface EventModel extends Model<EventDoc> {
  build: (event: EventAttrs) => EventDoc;
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<EventDoc | null>;
}

export interface EventPayload {
  id: string;
  title: string;
  start: string;
  end: string;
  timezone: string;
}

const eventSchema: Schema<EventDoc> = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    end: { type: Schema.Types.Date, required: true },
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
  return new Event({ _id: attrs.id, ...attrs });
};

eventSchema.set("versionKey", "version");
eventSchema.plugin(updateIfCurrentPlugin);

export const Event = model<EventDoc, EventModel>("Event", eventSchema);
