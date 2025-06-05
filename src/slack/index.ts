import "dotenv/config";
import { WebClient } from "@slack/web-api";
import { z } from "zod";

const token = process.env.SLACK_USER_TOKEN;
const web = new WebClient(token);

const SlackUser = z.object({
  user: z.string().optional(),
  user_id: z.string().optional(),
});

export const getSlackUser = async () => {
  const identity = await web.auth.test();

  if (identity.user_id === undefined) {
    throw new Error(
      `Must be using a user token. Given identity: ${JSON.stringify(identity)}`,
    );
  }

  return SlackUser.parse(identity);
};

const Channel = z.object({
  id: z.string(),
  name: z.string(),
});

const Message = z.object({
  channel: Channel,
  iid: z.string(),
  text: z.string(),
  user: z.string().nullable(),
  username: z.string().nullable(),
});

const SearchResponse = z.object({
  messages: z.object({
    matches: Message.array(),
    paging: z.object({
      count: z.number(),
      page: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
  }),
  ok: z.boolean(),
  query: z.string(),
});

type MessagesFromUserInput = {
  dayBeforeRange?: string;
  dayAfterRange?: string;
  page: number;
  search?: string;
  channelNames?: string[];
  userIds?: string[];
};

type DayRange = Pick<MessagesFromUserInput, "dayBeforeRange" | "dayAfterRange">;

const buildBeforeAfterFilter = ({
  dayBeforeRange,
  dayAfterRange,
}: DayRange): string | undefined => {
  if (dayBeforeRange === undefined || dayAfterRange === undefined) {
    return;
  }

  return `before:${dayAfterRange} after:${dayBeforeRange}`;
};

export const getMessages = async ({
  dayBeforeRange,
  dayAfterRange,
  page,
  search = "",
  channelNames = [],
  userIds = [],
}: MessagesFromUserInput) => {
  const channelFilter = channelNames.map((name) => `in:#${name}`).join(" ");
  const userFilter = userIds.map((id) => `from:${id}`).join(" ");
  const beforeAfterFilter = buildBeforeAfterFilter({
    dayBeforeRange,
    dayAfterRange,
  });

  const query = `${search} ${beforeAfterFilter} ${channelFilter}${userFilter}`;

  const response = await web.search.messages({
    query,
    sort: "timestamp",
    count: 100,
    page,
  });

  return SearchResponse.parse(response);
};

const Conversation = z.object({
  id: z.string(),
  name: z.string().optional(),
  user: z.string().optional(),
  created: z.number(),
  is_archived: z.boolean(),
  updated: z.number(),
  topic: z
    .object({
      value: z.string(),
    })
    .optional(),
});

const ConversationsResponse = z.object({
  channels: Conversation.array(),
  ok: z.boolean().optional(),
});

type GetAllConversationsInput = {
  includeArchived: boolean;
  includeGroupMessages: boolean;
  includeDirectMessages: boolean;
  includePublicChannels: boolean;
  includePrivateChannels: boolean;
};

const buildChannelTypesQuery = ({
  includeDirectMessages,
  includeGroupMessages,
  includePublicChannels,
  includePrivateChannels,
}: GetAllConversationsInput) => {
  const types: string[] = [];

  if (includeDirectMessages) types.push("im");
  if (includeGroupMessages) types.push("mpim");
  if (includePublicChannels) types.push("public_channel");
  if (includePrivateChannels) types.push("private_channel");

  return types.join(",");
};

export const getAllConversations = async (params: GetAllConversationsInput) => {
  const conversations = await web.conversations.list({
    exclude_archived: !params.includeArchived,
    types: buildChannelTypesQuery(params),
  });

  return ConversationsResponse.parse(conversations);
};
