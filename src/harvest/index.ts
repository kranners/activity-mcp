import "dotenv/config";

const harvestRequest = async (path: string, init?: Partial<RequestInit>) => {
  if (
    process.env.HARVEST_ACCESS_TOKEN === undefined ||
    process.env.HARVEST_ACCOUNT_ID === undefined
  ) {
    throw new Error("HARVEST_ACCESS_TOKEN and HARVEST_ACCOUNT_ID must be set.");
  }

  return fetch(`https://api.harvestapp.com/v2${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "activity-mcp",
      Authorization: "Bearer " + process.env.HARVEST_ACCESS_TOKEN,
      "Harvest-Account-ID": process.env.HARVEST_ACCOUNT_ID,
    },
    ...init,
  });
};

export const getHarvestUser = async () => {
  const response = await harvestRequest("/users/me");
  return JSON.stringify(await response.json());
};

export const getProjectAssignments = async () => {
  const response = await harvestRequest("/users/me/project_assignments");
  return JSON.stringify(await response.json());
};

type TimeEntry = {
  project_id: number;
  task_id: number;
  spent_date: string;
  hours: number;
  notes: string;
};

export const createTimeEntry = async (entry: TimeEntry) => {
  const response = await harvestRequest("/time_entries", {
    method: "POST",
    body: JSON.stringify(entry),
  });

  if (response.ok) {
    return "ok";
  }

  return `Failed to create time entry: ${await response.text()}`;
};
