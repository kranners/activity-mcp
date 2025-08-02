import "dotenv/config";

export const getTeamId = () => {
  const teamId = Number(process.env.CLICKUP_TEAM_ID);

  if (teamId === undefined || Number.isNaN(teamId)) {
    throw new Error("CLICKUP_TEAM_ID must be set to a number.");
  }

  return teamId;
};

const removeUndefinedKeyValues = (
  params?: Record<string, unknown | undefined>,
) => {
  if (params === undefined) {
    return {};
  }

  const filtered = Object.entries(params)
    .filter(([, value]) => {
      return value !== undefined;
    })
    .map(([key, value]) => {
      return [key, String(value)];
    });

  return Object.fromEntries(filtered);
};

const CLICKUP_API_BASE_URL = "https://api.clickup.com/api/v2";

export async function makeClickUpRequest(
  path: string,
  params?: Record<string, unknown | undefined>,
  options?: Partial<RequestInit>,
) {
  if (
    process.env.CLICKUP_TOKEN === undefined ||
    process.env.CLICKUP_TEAM_ID === undefined
  ) {
    throw new Error("CLICKUP_TOKEN and CLICKUP_TEAM_ID must be set.");
  }

  const parsedParams = new URLSearchParams(removeUndefinedKeyValues(params));

  const response = await fetch(
    `${CLICKUP_API_BASE_URL}${path}?${parsedParams}`,
    {
      method: "GET",

      ...options,

      headers: {
        accept: "application/json",
        Authorization: process.env.CLICKUP_TOKEN,
        ...options?.headers,
      },
    },
  );

  return response.json();
}

export const makePaginatedClickUpRequest = async (
  path: string,
  resultKey: string,
  params?: Record<string, unknown | undefined>,
) => {
  let currentPage = 0;
  let isLastPage = false;
  const pages = [];

  while (isLastPage === false) {
    const { last_page, ...rest } = await makeClickUpRequest(path, {
      ...params,
      page: currentPage,
    });

    pages.push(rest[resultKey] ?? []);

    isLastPage = last_page;
    currentPage++;
  }

  return pages.flat();
};
