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
    Please summarize any ClickUp tickets that have been updated between the week prior to ${dayForTimesheet} up to the day after.
    
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

  return await Promise.all([
    desktopActivity,
    calendarEvents,
    relatedTickets,
  ]).then(([desktopActivity, calendarEvents, relatedTickets]) => {
    return {
      desktopActivity,
      calendarEvents,
      relatedTickets,
    };
  });
};

const generateAndSubmitTimesheet = async (dayForTimesheet: string) => {
  const supporting =
    await generateTimesheetSupportingInformation(dayForTimesheet);
  const { desktopActivity, calendarEvents, relatedTickets } = supporting;

  await run(`
    Please create and submit a timesheet for ${dayForTimesheet} via Harvest.
    
    Some data gathering has already been done for you by other agents.
    These are summaries of:
    - The recently updated ClickUp tickets
    - Any calendar events on that day
    - A summary of desktop activity throughout the day. This is powerful!

    You will need to gather more data to accomplish this.
    In addition to what's given, you will need to gather:
    - All Slack messages sent on that day
    - The projects in Harvest. You will need this to be able to submit the timesheet
    - All Git reflogs for that day

    Here is the data that has already been gathered:
    --- START RELATED TICKETS ---
    ${relatedTickets}
    --- END RELATED TICKETS ---

    --- START CALENDAR EVENTS ---
    ${calendarEvents}
    --- END CALENDAR EVENTS ---

    --- START DESKTOP ACTIVITY ---
    ${desktopActivity}
    --- END DESKTOP ACTIVITY ---

    <approval>
    JUST submit the timesheet via Harvest.
    DO NOT ask for approval.
    </approval>

    <time_entries_format>
    When making a time entry, ALWAYS:
    1. Create seperate time entries when possible, instead of merging multiple entries into one.
    2. Create time entries for the correct client and project.
    3. Round time entries to the nearest 30 minutes.
    4. Ensure time entries sum to between 7.5 and 8 hours.
    5. Refer to the data used nonspecifically. eg. "Refer to git commits" or "Refer to Slack messages"
    6. Keep descriptions short and sharp. Just what was being worked on and for what.
    7. Avoid filling in detail where there is none.
    </time_entries_format

    <projects_and_clients>
    Meetings which are not related to any particular client should be listed as "Staff meeting".

    Meetings which are related to a client should be listed as billable client time.

    Client time should be billed under "Senior Developer".
    </projects_and_clients>
  `);
};

const DAYS_REQUIRING_TIMESHEET = [];

Promise.all(DAYS_REQUIRING_TIMESHEET.map(generateAndSubmitTimesheet)).then(() =>
  console.log("finished 🎉"),
);
