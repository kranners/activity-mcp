import { agent, run } from "./constants/index.js";

// I think the issue here now is that this is a local timestamp.
// Pretty sure it needs to be like that.
// So to fix should probably chuck up a local TZ version of the time tool.
const getTimesheet = async () => {
  const response = await run(`
    Could you summarize my desktop activity between 2025-05-26T09:00:00+10:00 and 2025-05-26T17:00:00+10:00? 
    Ensure you get all the data available.

    Break it down in 30 minute chunks like:
    ### 09:00–09:30
    <A description of what was happening at that time.>
    <A line break>
    <A breakdown of which applications were used and for what amount of time>
    <Like:>
    <50% - Arc>
    <10% - another application, etc>
  `);

  console.log(response);

  await agent.close();
};

getTimesheet();
