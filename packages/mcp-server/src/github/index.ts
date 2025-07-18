import "dotenv/config";
import { graphql } from "@octokit/graphql";

const VIEWER_QUERY = `
  query {
    viewer {
      login
      name
    }
  }
`;

const USER_CONTRIBUTIONS_QUERY = `
  query activity($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            owner {
              login
            }
          }
          contributions(first: 50) {
            nodes {
              commitCount
              occurredAt
            }
            totalCount
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions(first: 50) {
            nodes {
              occurredAt
              pullRequest {
                title
                url
                body
                closed
                closedAt
                updatedAt
              }
            }
          }
        }
        pullRequestReviewContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
          }
          contributions(first: 50) {
            nodes {
              occurredAt
              pullRequest {
                title
                url
                body
                closed
                closedAt
                updatedAt
              }
              pullRequestReview {
                state
                comments(first: 50){
                  nodes {
                    body
                    diffHunk
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ContributionsInput = {
  username: string;
  from: string;
  to: string;
};

const getGraphqlClient = () => {
  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error("GITHUB_TOKEN must be set.");
  }

  return graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
};

export const getUserContributions = async (params: ContributionsInput) => {
  const graphqlWithAuth = getGraphqlClient();
  return graphqlWithAuth(USER_CONTRIBUTIONS_QUERY, params);
};

export const getGitHubUser = async () => {
  const graphqlWithAuth = getGraphqlClient();
  return graphqlWithAuth(VIEWER_QUERY);
};
