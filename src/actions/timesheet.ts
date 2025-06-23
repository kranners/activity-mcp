import { agent, run } from "./constants/index.js";

const getTimesheet = async () => {
  const dayForTimesheet = process.argv[2];
  //
  // const desktopActivity = await run(`
  //   Please summarize my desktop activity for ${dayForTimesheet} between 9am and 10pm.
  //
  //   Break it down in 30 minute chunks like:
  //   ### 09:00–09:30
  //   Activity: <Brief and purposeful summary of what I did during that period>
  //   Goals: <Brief and purposeful summary of my goals during that period, what I was working towards overall.>
  //
  //   <Repeat that format for the rest of the time period.>
  //   <Do not create a 30 minute chunk for a period with no activity. Just skip them entirely and start when there is activity.>
  //
  //   Then include a similar summary for the entire time period.
  // `);
  //
  // const calendarEvents = await run(`
  //   Please summarize my Google Calendar events for ${dayForTimesheet} between 9am and 10pm.
  //
  //   Format each as:
  //   ## <Name of event>
  //   At <time of event> for <duration of event>.
  //
  //   <Description of event>.
  // `);

  const relatedTickets = await run(`
Please summarize any ClickUp tickets that have been updated between the week prior to ${dayForTimesheet} up to the day after.

ONLY include tickets that the USER is involved in some way.
NEVER use the assignees filter. This will filter out tickets the USER is a watcher on.
ALWAYS include ALL pages of data, if they are available.

Format each ClickUp ticket as:
# <[Title](URL)> (<Ticket Custom ID>)
<Space> -> <Folder> -> <List>
Currently: <Ticket status>

<Short summary of description and purpose.>
<Short summary of the USERs role in this ticket.>
`);

  console.log(relatedTickets);

  await agent.close();
};

getTimesheet();
