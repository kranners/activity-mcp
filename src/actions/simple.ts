import { agent, run } from "./constants/index.js";

const runAllPrompts = async () => {
  const clickupUser = await run("Tell me my ClickUp user ID and username.");
  const githubUsername = await run("Tell me my username on GitHub.");
  const repository = await run("Tell me a random one of my git repositories.");
  const harvestUserId = await run("Tell me my user ID on Harvest.");
  const googleEmail = await run("Tell me my email on Google.");
  const time = await run("Tell me the current time as an ISO timestamp.");
  const slackUser = await run("Tell me my name and user ID on Slack.");

  console.log({
    clickupUser,
    githubUsername,
    gitRepository: repository,
    harvestUserId,
    googleEmail,
    currentTime: time,
    slackUser,
  });

  await agent.close();
};

runAllPrompts();
