import { run } from "../constants/index.js";

const generateTimesheetSupportingInformation = async (
  dayForTimesheet: string,
) => {
  const desktopActivity = run(`
    Please summarize my desktop activity for ${dayForTimesheet} between 9am and 10pm.
  
    Break it down in 30 minute chunks like:
    ### 09:00–09:30
    Activity: <Brief and purposeful summary of what I did during that period>
    Goals: <Brief and purposeful summary of my goals during that period, what I was working towards overall.>
  
    <Repeat that format for the rest of the time period.>
    <Do not create a 30 minute chunk for a period with no activity. Just skip them entirely and start when there is activity.>
  
    Then include a similar summary for the entire time period.
  `);

  const calendarEvents = run(`
    Please summarize my Google Calendar events for ${dayForTimesheet} between 9am and 10pm.
  
    Format each as:
    ## <Name of event>
    At <time of event> for <duration of event>.
  
    <Description of event>.
  `);

  const relatedTickets = run(`
    Please summarize any ClickUp tickets that have been updated between 3 days prior to ${dayForTimesheet} up to the day after.
    
    ONLY include tickets that the USER is involved in some way.
    NEVER use the assignees filter. This will filter out tickets the USER is a watcher on.
    
    Format each ClickUp ticket as:
    # <[Title](URL)> (<Ticket Custom ID>)
    Created: <When the ticket was made>
    <Space> -> <Folder> -> <List>
    
    Currently: <Ticket status>
    <If closed, say when it was closed. Otherwise, say when it was last updated.>
    
    <Short summary of description and purpose.>
    <Short summary of the users role in this ticket.>
  `);

  const slackMessages = run(`
    Please extract and format Slack messages sent on the 22nd of July.
    Retrieve ALL messages from ALL users, regardless of sender.

    ## Format

    Use this format:
    ### #general
    - (09:00) John Doe: How was everyone's weekend?
    - (09:02) Sara Jane: Mine was great!
    <repeat for all the other channels>

    ENSURE messages are included in chronological order.

    ALWAYS include ALL messages in a given channel.
    However, don't include anything from the #in-and-out channel. This can be considered useless noise.

    ONLY include channels where THE USER sent a message on that day.
  `);

  return await Promise.all([
    desktopActivity,
    calendarEvents,
    relatedTickets,
    slackMessages,
  ]).then(
    ([desktopActivity, calendarEvents, relatedTickets, slackMessages]) => {
      return {
        desktopActivity,
        calendarEvents,
        relatedTickets,
        slackMessages,
      };
    },
  );
};

const generateAndSubmitTimesheet = async (dayForTimesheet: string) => {
  const supporting =
    await generateTimesheetSupportingInformation(dayForTimesheet);
  const { desktopActivity, calendarEvents, relatedTickets, slackMessages } =
    supporting;

  await run(`
    Please create and submit a timesheet for last Tuesday via Harvest.

    Use:
    - Slack messages sent on that day.
    - Harvest.
    - The git reflogs.
    - Recently updated ClickUp tickets (provided for you).
    - Calendar events (provided for you).
    - Desktop activity summary (provided for you).

    <ClickUp Tickets>
    ${relatedTickets}
    </ClickUp Tickets>

    <Calendar Events>
    ${calendarEvents}
    </Calendar Events>

    <Desktop Activity>
    ${desktopActivity}
    </Desktop Activity>

    <Slack Messages>
    ${slackMessages}
    </Slack Messages>
    

    Then submit the timesheet via Harvest.

    Write concise and obvious entries that whenever possible, refer to a ClickUp custom ID and card title.

    Meetings which are not related to any particular client should be listed as "Staff meeting".
    Meetings which are related to a client should be listed as billable client time.

    Client time should be billed under "Senior Developer".
  `);
};

const DAYS_REQUIRING_TIMESHEET = [
  "22 July 2025",
  // "24 July 2025",
  // "25 July 2025",
  // "29 July 2025",
  // "30 July 2025",
];

Promise.all(DAYS_REQUIRING_TIMESHEET.map(generateAndSubmitTimesheet)).then(() =>
  console.log("finished 🎉"),
);
