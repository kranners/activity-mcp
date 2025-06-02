import { graphql } from "@octokit/graphql";
import * as dotenv from "dotenv";

dotenv.config();

const { GITHUB_TOKEN } = process.env;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

// Define the expected result type
type ViewerLoginResult = {
  viewer: {
    login: string;
    repositories: {
      nodes: { name: string }[];
    };
  };
};

const query = `
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
              pullRequestReview {
                pullRequest {
                  title
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function main() {
  const result = await graphqlWithAuth<ViewerLoginResult>(query, {
    num: 5,
  });

  console.log(JSON.stringify(result, null, 2));
}

main();
