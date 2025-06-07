import "dotenv/config";
import { readFile, writeFile } from "fs/promises";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google, Auth } from "googleapis";
import { existsSync } from "fs";
import { z } from "zod";

const SCOPES = [
  "https://www.googleapis.com/auth/directory.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar",
];

const { GOOGLE_TOKEN_PATH, GOOGLE_CREDENTIALS_PATH } = process.env;

const loadSavedCredentialsIfExist = async (): Promise<
  Auth.OAuth2Client | undefined
> => {
  if (GOOGLE_TOKEN_PATH === undefined) {
    return undefined;
  }

  if (!existsSync(GOOGLE_TOKEN_PATH)) {
    return undefined;
  }

  const content = await readFile(GOOGLE_TOKEN_PATH, { encoding: "utf8" });
  const credentials = JSON.parse(content);

  return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
};

const saveCredentials = async (client: Auth.OAuth2Client): Promise<void> => {
  if (
    GOOGLE_CREDENTIALS_PATH === undefined ||
    GOOGLE_TOKEN_PATH === undefined
  ) {
    return undefined;
  }

  const content = await readFile(GOOGLE_CREDENTIALS_PATH, { encoding: "utf8" });
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;

  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });

  await writeFile(GOOGLE_TOKEN_PATH, payload, {
    encoding: "utf8",
    flag: "w",
  });
};

const authorize = async (): Promise<Auth.OAuth2Client> => {
  const savedClient = await loadSavedCredentialsIfExist();
  if (savedClient) {
    return savedClient;
  }

  if (GOOGLE_CREDENTIALS_PATH === undefined) {
    throw new Error("GOOGLE_CREDENTIALS_PATH must be set.");
  }

  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: GOOGLE_CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
};

const Name = z.object({
  displayName: z.string().optional(),
});

const Email = z.object({
  value: z.string().optional(),
});

const User = z.object({
  names: Name.array().optional(),
  emailAddresses: Email.array().optional(),
});

export const getGoogleUser = async () => {
  const auth = await authorize();
  const people = google.people({ version: "v1", auth });

  const { data: user } = await people.people.get({
    resourceName: "people/me",
    personFields: "names,emailAddresses",
  });

  return User.parse(user);
};

const Directory = z.object({
  people: User.array(),
});

export const getGoogleDirectoryPeople = async () => {
  const auth = await authorize();
  const people = google.people({ version: "v1", auth });

  const { data: directory } = await people.people.listDirectoryPeople({
    readMask: "names,emailAddresses",
    sources: ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"],
  });

  return Directory.parse(directory);
};

export const ResponseStatus = z.enum([
  "declined",
  "needsAction",
  "accepted",
  "tentative",
]);

type ResponseStatus = z.infer<typeof ResponseStatus>;

const Creator = z.object({
  email: z.string().email(),
});

const Organizer = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
});

export const DateTimeOrDate = z.object({
  dateTime: z.string().optional(),
  date: z.string().optional(),
  timeZone: z.string().optional(),
});

export const Attendee = z.object({
  email: z.string().email(),
  responseStatus: ResponseStatus.optional(),
  displayName: z.string().optional(),
});

const Reminders = z.any();

const Event = z.object({
  id: z.string(),
  status: z.enum(["confirmed", "tentative", "cancelled"]),
  htmlLink: z.string().url(),
  created: z.string().optional(),
  description: z.string().nullable().optional(),
  summary: z.string().optional(),
  creator: Creator.optional(),
  organizer: Organizer.optional(),
  start: DateTimeOrDate,
  end: DateTimeOrDate,
  recurringEventId: z.string().optional(),
  originalStartTime: DateTimeOrDate.optional(),
  attendees: z.array(Attendee).optional(),
  reminders: Reminders.optional(),
  transparency: z.enum(["opaque", "transparent"]).optional(),
  location: z.string().optional(),
});

export const Events = z.array(Event);

type GetGoogleCalendarEventsInput = {
  calendarId: string;
  pageToken?: string;
  q?: string;
  timeMax?: string;
  timeMin?: string;
  showDeleted?: boolean;
};

export const getCalendarEvents = async (
  params: GetGoogleCalendarEventsInput,
) => {
  const auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth });

  const response = await calendar.events.list(params);

  const events = response.data.items;
  return Events.parse(events);
};

type RespondToCalendarEventInputs = {
  calendarId: string;
  eventId?: string;
  response: ResponseStatus;
};

export const respondToCalendarEvent = async ({
  calendarId,
  eventId,
  response,
}: RespondToCalendarEventInputs) => {
  const auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth });
  const { data: event } = await calendar.events.get({ calendarId, eventId });

  if (!event.attendees || !event.attendees.length) {
    throw new Error("No attendees found on this event.");
  }

  const me = await getGoogleUser();
  const email = me.emailAddresses?.[0].value;

  if (email === undefined) {
    throw new Error(`Unable to get email of user, user: ${me}`);
  }

  const attendees = event.attendees.map((attendee) => {
    if (attendee.email === email) {
      return { ...attendee, responseStatus: response };
    }

    return attendee;
  });

  const { data: updatedEvent } = await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: { attendees },
  });

  return Event.parse(updatedEvent);
};

export const Reminder = z.object({
  method: z.literal("popup"),
  minutes: z.number(),
});

type CreateCalendarEventInput = {
  calendarId: string;
  attendeesEmails: string[];
  description: string;
  fullDayEventStartDate?: string;
  fullDayEventEndDate?: string;
  nonFullDayEventStartDateTime?: string;
  nonFullDayEventEndDateTime?: string;
  timeZone: string;
  location?: string;
  summary: string;
  recurrence?: string[];
  remindersMinutes: number[];
};

export const createCalendarEvent = async ({
  calendarId,
  remindersMinutes,
  fullDayEventStartDate,
  fullDayEventEndDate,
  nonFullDayEventStartDateTime,
  nonFullDayEventEndDateTime,
  timeZone,
  attendeesEmails,
  ...params
}: CreateCalendarEventInput) => {
  const auth = await authorize();
  const calendar = google.calendar({ version: "v3", auth });
  const attendees = attendeesEmails.map((email) => ({ email }));
  const reminders = {
    overrides: remindersMinutes.map((minutes) => ({
      method: "popup",
      minutes,
    })),
  };

  const requestBody = {
    start: {
      date: fullDayEventStartDate,
      dateTime: nonFullDayEventStartDateTime,
      timeZone,
    },
    end: {
      date: fullDayEventEndDate,
      dateTime: nonFullDayEventEndDateTime,
      timeZone,
    },
    attendees,
    reminders,
    ...params,
  };

  const newEvent = calendar.events.insert({ calendarId, requestBody });

  return Event.parse(newEvent);
};
