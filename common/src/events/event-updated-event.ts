import { Subjects } from "./subjects";

export interface EventUpdatedEvent {
  subject: Subjects.EventUpdated;
  data: {
    id: string;
    title: string;
    url: string;
    image: string;
    start: string;
    end: string;
    timezone: string;
    version: number;
  };
}
