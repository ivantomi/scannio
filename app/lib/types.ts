import { Attendee, Entry } from "@prisma/client";

export interface AttendeeWithEntries extends Attendee {
  entries: Entry[];
}
