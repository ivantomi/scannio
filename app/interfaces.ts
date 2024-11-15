import { Attendee, Entry } from "@prisma/client";

export interface AttendeeWithEntries extends Attendee {
  entriesGroupedByDay: Record<string, Entry[]>;
  entries: Entry[];
}
