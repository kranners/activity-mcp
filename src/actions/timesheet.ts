import { agent, run } from "./constants/index.js";

const getTimesheet = async () => {
  const response = await run(`
    Could you summarize my desktop activity today between 9am and 10pm?

    Break it down in 30 minute chunks like:
    ### 09:00–09:30
    Activity: <Brief and purposeful summary of what I did during that period>
    Goals: <Brief and purposeful summary of my goals during that period, what I was working towards overall.>

    <Repeat that format for the rest of the time period.>
    <Do not create a 30 minute chunk for a period with no activity. Just skip them entirely and start when there is activity.>

    Then include a similar summary for the entire time period.
  `);

  console.log(response);

  await agent.close();
};

getTimesheet();
