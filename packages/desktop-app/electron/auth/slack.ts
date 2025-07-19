import { app, BrowserWindow } from "electron";
import "dotenv/config";
import {
  AuthorizeResult,
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
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { agent } from "../agent";

export type SlackUserInfo = {
  avatar: string;
  name: string;
};

const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_STATE_SECRET } =
  process.env;

const INSTALLATION_CONFIG_PATH = join(
  app.getPath("appData"),
  "slack_installation.json",
);

if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
  throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
}

console.log({ INSTALLATION_CONFIG_PATH });

const installer = new InstallProvider({
  clientId: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  stateSecret: SLACK_STATE_SECRET,
  logLevel: LogLevel.DEBUG,
  installationStore: new FileInstallationStore(),
});

async function setSlackIntegrationEnvironment(install: AuthorizeResult) {
  process.env.SLACK_USER_TOKEN = install.userToken;

  const authorizedClient = new WebClient(install.userToken);

  const { user_id: user } = await authorizedClient.auth.test();
  const { profile } = await authorizedClient.users.profile.get({ user });

  if (profile) {
    process.env.SLACK_USER_NAME = profile.display_name;
    process.env.SLACK_USER_AVATAR = profile.image_72;
  }

  await agent.initialize();
}

export async function attemptToPreloadSlackAuthorization() {
  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
    throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
  }

  if (existsSync(INSTALLATION_CONFIG_PATH)) {
    const installationFileContents = readFileSync(INSTALLATION_CONFIG_PATH);
    const installationQuery = JSON.parse(installationFileContents.toString());

    const install = await installer.authorize(installationQuery);
    await setSlackIntegrationEnvironment(install);

    return true;
  }
}

export function getSlackIntegrationInfo(win: BrowserWindow) {
  const { SLACK_USER_TOKEN, SLACK_USER_AVATAR, SLACK_USER_NAME } = process.env;

  if (!SLACK_USER_TOKEN || !SLACK_USER_NAME || !SLACK_USER_AVATAR) {
    return win.webContents.send("sendSlackIntegration", undefined);
  }

  win.webContents.send("sendSlackIntegration", {
    avatar: SLACK_USER_AVATAR,
    name: SLACK_USER_NAME,
  });
}

async function getSlackAuthorization(code: string, installer: InstallProvider) {
  const isPreloaded = await attemptToPreloadSlackAuthorization();

  if (isPreloaded) {
    return;
  }

  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
    throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
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
  setSlackIntegrationEnvironment(install);
}

export async function startSlackOauthFlow(win: BrowserWindow) {
  win.webContents.on("did-finish-load", async () => {
    const url = parse(win.webContents.getURL(), true);

    const { code } = url.query;

    if (!code || typeof code !== "string") {
      return;
    }

    await getSlackAuthorization(code, installer);

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
      "users.profile:read",
    ],
  });

  return await win.loadURL(installUrl).catch(console.warn);
}

export function disconnectSlackIntegration() {
  if (!existsSync(INSTALLATION_CONFIG_PATH)) {
    console.error("Attempted to disconnect without a Slack integration!");
    return;
  }

  const installationFileContents = readFileSync(INSTALLATION_CONFIG_PATH);
  const installationQuery = JSON.parse(installationFileContents.toString());

  process.env.SLACK_USER_TOKEN = undefined;
  process.env.SLACK_USER_NAME = undefined;
  process.env.SLACK_USER_AVATAR = undefined;

  installer.installationStore.deleteInstallation?.(installationQuery);
  unlinkSync(INSTALLATION_CONFIG_PATH);
}
