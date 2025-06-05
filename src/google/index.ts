import "dotenv/config";
import { readFile, writeFile } from "fs/promises";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google, Auth } from "googleapis";
import { existsSync } from "fs";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
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

const listEvents = async (auth: Auth.OAuth2Client): Promise<void> => {
  const calendar = google.calendar({ version: "v3", auth });

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }

  console.log("Upcoming 10 events:");
  events.forEach((event) => {
    const start = event.start?.dateTime || event.start?.date || "Unknown start";
    console.log(`${start} - ${event.summary ?? "No summary"}`);
  });
};

// Entry point
authorize().then(listEvents).catch(console.error);
