import "dotenv/config";
import { Dirent, readdirSync } from "fs";
import { join } from "path";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

const getDirentPath = (dirent: Dirent) => {
  return join(dirent.parentPath, dirent.name);
};

const isDirentGitRepository = (dirent: Dirent) => {
  if (!dirent.isDirectory()) {
    return false;
  }

  const contents = readdirSync(getDirentPath(dirent), { withFileTypes: true });

  return contents.some((child) => {
    return child.isDirectory() && child.name === ".git";
  });
};

export const getLocalGitRepositories = () => {
  const root = process.env.GIT_REPOSITORIES_ROOT_DIRECTORY;

  if (root === undefined) {
    throw new Error("Variable GIT_REPOSITORIES_ROOT_DIRECTORY must be set.");
  }

  const immediatelyUnderRoot = readdirSync(root, { withFileTypes: true });
  const repositories = immediatelyUnderRoot.filter(isDirentGitRepository);

  return repositories;
};

type Reflog = {
  hash: string;
  refs?: string;
  date: string;
  action: string;
  message: string;
};

const parseReflogLine = (line: string): Reflog | null => {
  line = line.trim();

  const regex =
    /^([a-f0-9]+)(?: \(([^)]+)\))? HEAD@\{([^}]+)\}: ([^:]+): (.+)$/;

  const match = line.match(regex);
  if (!match) return null;

  const [, hash, refs, date, action, message] = match;

  return { hash, refs, date, action: action.trim(), message: message.trim() };
};

type GetRepositoryReflogInput = {
  repository: Dirent;
  since: string;
  until: string;
};

const getRepositoryReflog = async ({
  repository,
  since,
  until,
}: GetRepositoryReflogInput) => {
  const path = getDirentPath(repository);

  const command = `git -C ${path} reflog --date=iso --since '${since}' --until '${until}'`;
  const { stdout, stderr } = await execAsync(command);

  if (stderr) {
    // TODO: May want to bubble up errors here.
    return [];
  }

  const reflog = stdout.split("\n").map(parseReflogLine);
  return reflog.filter(Boolean);
};

type GetAllRepositoriesReflogsInput = Omit<
  GetRepositoryReflogInput,
  "repository"
> & {
  includeEmpty: boolean;
};

export const getAllRepositoriesReflogs = async ({
  since,
  until,
  includeEmpty,
}: GetAllRepositoriesReflogsInput) => {
  const repositories = getLocalGitRepositories();

  const resultPromises = repositories.map(async (repository) => {
    return {
      repository,
      reflog: await getRepositoryReflog({ repository, since, until }),
    };
  });

  const results = await Promise.all(resultPromises);

  if (includeEmpty) {
    return results;
  }

  return results.filter(({ reflog }) => reflog.length > 0);
};
