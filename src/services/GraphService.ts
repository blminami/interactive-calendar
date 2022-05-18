import moment, { Moment } from 'moment';
import { Event } from 'microsoft-graph';
import {
  GraphRequestOptions,
  PageCollection,
  PageIterator
} from '@microsoft/microsoft-graph-client';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: any) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client
    .api('/me')
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
}

export async function getUserCalendar(
  accessToken: string,
  timeZone: string,
  startDate: Moment,
  type: 'week' | 'month'
): Promise<Event[]> {
  const client = getAuthenticatedClient(accessToken);

  const startDateTime = startDate.format();
  let endDateTime;
  if (type === 'month') {
    endDateTime = moment(startDate).add(1, 'month').format();
  } else {
    endDateTime = moment(startDate).add(7, 'day').format();
  }

  // GET /me/calendarview?startDateTime=''&endDateTime=''
  // &$select=subject,organizer,start,end
  // &$orderby=start/dateTime
  // &$top=50
  const response: PageCollection = await client
    .api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    .select('subject,organizer,start,end')
    .orderby('start/dateTime')
    .top(50)
    .get();

  if (response['@odata.nextLink']) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    const events: Event[] = [];

    // Must include the time zone header in page
    // requests too
    const options: GraphRequestOptions = {
      headers: { Prefer: `outlook.timezone="${timeZone}"` }
    };

    const pageIterator = new PageIterator(
      client,
      response,
      (event) => {
        event.date = moment(event.start.dateTime);
        events.push(event);
        return true;
      },
      options
    );

    await pageIterator.iterate();

    return events;
  } else {
    response.value.map((event) => {
      event.date = {
        start: moment(event.start.dateTime),
        end: moment(event.end.dateTime)
      };
      return event;
    });
    return response.value;
  }
}
