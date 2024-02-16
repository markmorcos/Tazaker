import { Subjects } from "./subjects";

export interface EventCreatedEvent {
  subject: Subjects.EventCreated;
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
