import { graphql } from "@octokit/graphql";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable not set.');
  console.error('Please create a .env file and add your GitHub Personal Access Token.');
  process.exit(1);
}

// Create a graphql instance with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

// Define the expected result type
interface ViewerLoginResult {
  viewer: {
    login: string;
    repositories: {
      nodes: { name: string }[];
    };
  };
}

// Define the query using variables
const query = `
  query viewerLogin($num: Int = 3) {
    viewer {
      login
      repositories(last: $num) {
        nodes {
          name
        }
      }
    }
  }
`;

// Define variables for the query
const variables = {
  num: 5, // Example: Fetch last 5 repositories
};

async function main() {
  try {
    console.log("Fetching viewer login and repositories...");
    // Execute the query and assert the type
    const result = await graphqlWithAuth<ViewerLoginResult>(query, variables);
    console.log("Query successful!");
    console.log("Viewer Login:", result.viewer.login);
    console.log("Last Repositories:", result.viewer.repositories.nodes.map((repo: { name: string }) => repo.name));

  } catch (error: any) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
      // Log additional details if available (like from GraphqlResponseError)
      if ('request' in error) {
        console.error("Request details:", (error as any).request);
      }
      if ('data' in error) {
        console.error("Partial data received:", (error as any).data);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
    process.exit(1);
  }
}

main(); 