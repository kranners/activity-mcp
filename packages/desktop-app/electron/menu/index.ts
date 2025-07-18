import { app, BrowserWindow, Menu } from "electron";
import "dotenv/config";
import {
  FileInstallationStore,
  Installation,
  InstallationQuery,
  InstallProvider,
  LogLevel,
  OAuthV2Response,
} from "@slack/oauth";
import { parse } from "url";
import { navigateHome } from "../main";
import { WebClient } from "@slack/web-api";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { agent } from "../agent";

const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_STATE_SECRET } =
  process.env;

const INSTALLATION_CONFIG_PATH = join(
  app.getPath("appData"),
  "slack_installation.json",
);

console.log({ INSTALLATION_CONFIG_PATH });

if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
  throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
}

const installer = new InstallProvider({
  clientId: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  stateSecret: SLACK_STATE_SECRET,
  logLevel: LogLevel.DEBUG,
  installationStore: new FileInstallationStore(),
});

export async function attemptToPreloadSlackAuthorization() {
  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
    throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
  }

  if (existsSync(INSTALLATION_CONFIG_PATH)) {
    const installationFileContents = readFileSync(INSTALLATION_CONFIG_PATH);
    const installationQuery = JSON.parse(installationFileContents.toString());

    const install = await installer.authorize(installationQuery);
    process.env.SLACK_USER_TOKEN = install.userToken;

    await agent.initialize();
  }
}

async function getSlackAuthorization(
  code: string,
  installer: InstallProvider,
  win: BrowserWindow,
) {
  await attemptToPreloadSlackAuthorization();

  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
    throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
  }

  if (existsSync(INSTALLATION_CONFIG_PATH)) {
    const installationFileContents = readFileSync(INSTALLATION_CONFIG_PATH);
    const installationQuery = JSON.parse(installationFileContents.toString());

    const install = await installer.authorize(installationQuery);
    process.env.SLACK_USER_TOKEN = install.userToken;
    await agent.initialize();

    return win.webContents.send(
      "bot-message",
      "Finished authorizing to Slack.",
    );
  }

  const web = new WebClient(undefined);

  const response = (await web.oauth.v2.access({
    code,
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET,
  })) as OAuthV2Response;

  const installation: Installation<"v2", boolean> = {
    team: response.team === null ? undefined : response.team,
    enterprise: response.enterprise == null ? undefined : response.enterprise,
    user: {
      token: response.authed_user.access_token,
      scopes: response.authed_user.scope?.split(","),
      id: response.authed_user.id,
    },
    tokenType: response.token_type,
    isEnterpriseInstall: response.is_enterprise_install,
    appId: response.app_id,
    authVersion: "v2",
  };

  installer.installationStore.storeInstallation(installation);

  const installationQuery: InstallationQuery<boolean> = {
    isEnterpriseInstall: response.is_enterprise_install,
    teamId: response.team?.id,
    enterpriseId: response.enterprise?.id,
  };

  writeFileSync(INSTALLATION_CONFIG_PATH, JSON.stringify(installationQuery));

  const install = await installer.authorize(installationQuery);
  process.env.SLACK_USER_TOKEN = install.userToken;

  await agent.initialize();

  return win.webContents.send("bot-message", "Finished authorizing to Slack.");
}

async function startSlackOauthFlow(win: BrowserWindow) {
  win.webContents.on("did-finish-load", async () => {
    const url = parse(win.webContents.getURL(), true);

    const { code } = url.query;

    if (!code || typeof code !== "string") {
      return;
    }

    await getSlackAuthorization(code, installer, win);

    navigateHome(win);
  });

  const installUrl = await installer.generateInstallUrl({
    scopes: [],
    userScopes: [
      "channels:history",
      "channels:read",
      "groups:history",
      "groups:read",
      "im:history",
      "mpim:history",
      "mpim:read",
      "search:read",
    ],
  });

  return await win.loadURL(installUrl).catch(console.warn);
}

export function buildMenu(win: BrowserWindow) {
  const { items } = Menu.buildFromTemplate([
    {
      label: "OAuth",
      submenu: [
        {
          click: () => {
            return win.webContents.send(
              "bot-message",
              "This is a test message!",
            );
          },
          label: "Send test message",
        },
        {
          label: "Start Slack OAuth",
          click: async () => await startSlackOauthFlow(win),
        },
        {
          label: "Attempt to preload Slack OAuth",
          click: async () => await attemptToPreloadSlackAuthorization(),
        },
      ],
    },
  ]);

  const menu = Menu.getApplicationMenu();

  if (menu === null) {
    throw new Error("The existing menu was somehow null!");
  }

  items.forEach((item) => menu.append(item));
  Menu.setApplicationMenu(menu);
}
