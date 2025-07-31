import "dotenv/config";
import { WebClient } from "@slack/web-api";
import { z } from "zod";
import { TZ_OFFSET_IN_SECONDS } from "../time/index.js";

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
  text: z.string().optional().nullable(),
  user: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  ts: z.string().optional().nullable(),
});

const SearchResponse = z.object({
  messages: z.object({
    matches: Message.array(),
    paging: z.object({
      pages: z.number(),
    }),
  }),
  ok: z.boolean(),
  query: z.string(),
});

type MessagesFromUserInput = {
  dateRangeStart?: string;
  dateRangeEnd?: string;
  search?: string;
  channelNames?: string[];
  userIds?: string[];
};

type DayRange = Pick<MessagesFromUserInput, "dateRangeStart" | "dateRangeEnd">;

const buildBeforeAfterFilter = ({
  dateRangeStart,
  dateRangeEnd,
}: DayRange): string | undefined => {
  if (dateRangeStart === undefined || dateRangeEnd === undefined) {
    return;
  }

  // Slack API requires that "before" be a full day before your range starts.
  // and "after" be a full day after your range ends. This is confusing for agents.
  const beforeDate = new Date(dateRangeEnd);
  const afterDate = new Date(dateRangeStart);

  beforeDate.setDate(beforeDate.getDate() + 1);
  afterDate.setDate(afterDate.getDate() - 1);

  const before = beforeDate.toISOString().split("T")[0];
  const after = afterDate.toISOString().split("T")[0];

  return `before:${before} after:${after}`;
};

const formatMessageForToolResponse = (message: z.infer<typeof Message>) => {
  if (!message.ts) {
    return message;
  }

  const localTsMillis = (Number(message.ts) - TZ_OFFSET_IN_SECONDS) * 1000;
  const sent = new Date(localTsMillis).toISOString();

  return {
    ...message,
    ts: sent,
  };
};

const buildSlackMessageQuery = ({
  dateRangeStart,
  dateRangeEnd,
  search = "",
  channelNames = [],
  userIds = [],
}: MessagesFromUserInput) => {
  const channelFilter = channelNames.map((name) => `in:#${name}`).join(" ");
  const userFilter = userIds.map((id) => `from:${id}`).join(" ");
  const beforeAfterFilter = buildBeforeAfterFilter({
    dateRangeStart,
    dateRangeEnd,
  });

  return `${search} ${beforeAfterFilter} ${channelFilter}${userFilter}`;
};

export const getMessages = async (params: MessagesFromUserInput) => {
  const query = buildSlackMessageQuery(params);

  const getSlackPage = async (page = 1) => {
    return await web.search.messages({
      query,
      sort: "timestamp",
      count: 100,
      page,
    });
  };

  const messages = [];

  let page = 1;
  let stopPaginatingAt = 2;

  while (stopPaginatingAt >= page) {
    const response = await getSlackPage(page);

    const parsed = SearchResponse.parse(response);

    const {
      messages: {
        matches,
        paging: { pages },
      },
    } = parsed;

    stopPaginatingAt = pages;
    page++;

    messages.push(...matches);
  }

  return messages.map(formatMessageForToolResponse);
};
