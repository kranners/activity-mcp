import 'dotenv/config';
import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_USER_TOKEN;
const web = new WebClient(token);

export const getUserId = async () => {
  const identity = await web.auth.test();

  if (identity.user_id === undefined) {
    throw new Error(`Must be using a user token. Given identity: ${JSON.stringify(identity)}`);
  }

  return identity.user_id;
}

type MessagesFromUserInput = {
  before: string;
  after: string;
}

export const getMessagesFromUser = async ({ before, after }: MessagesFromUserInput) => {
  const userId = await getUserId();

  return web.search.messages({
    query: `from:@${userId} before:${before} after:${after}`,
    sort: "timestamp",
    count: 20,
  });
}
