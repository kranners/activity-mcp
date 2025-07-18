import "dotenv/config";
import { FileInstallationStore, InstallProvider, LogLevel } from "@slack/oauth";
import express from "express";
import { WebClient } from "@slack/web-api";

const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_STATE_SECRET } =
  process.env;

if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
  throw new Error("SLACK_CLIENT_ID and SLACK_STATE_SECRET must be set.");
}

const app = express();

const installer = new InstallProvider({
  clientId: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  stateSecret: SLACK_STATE_SECRET,
  logLevel: LogLevel.DEBUG,
  installationStore: new FileInstallationStore(),
});

app.get("/slack/oauth_redirect", async (req, res) => {
  await installer.handleCallback(req, res, {
    async afterInstallation() {
      return true;
    },
  });
});

app.get("/slack/whoami", async (_req, res) => {
  const install = await installer.authorize({
    isEnterpriseInstall: false,
    teamId: "T0BHNMKGT",
    enterpriseId: undefined,
  });

  const web = new WebClient(install.userToken);
  const identity = await web.auth.test();

  res.send(JSON.stringify(identity));
});

app.listen(3000);
