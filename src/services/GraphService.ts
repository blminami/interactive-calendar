import moment, { Moment } from 'moment';
import { Event } from 'microsoft-graph';
import {
  GraphRequestOptions,
  PageCollection,
  PageIterator
} from '@microsoft/microsoft-graph-client';
import { CalendarMode } from '../calendar/Calendar.helper';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken: string) {
  const client = graph.Client.init({
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
  type: CalendarMode
): Promise<Event[]> {
  const client = getAuthenticatedClient(accessToken);

  const startDateTime = startDate.format();
  let endDateTime;
  if (type === CalendarMode.Month) {
    endDateTime = moment(startDate).add(1, 'month').format();
  } else {
    endDateTime = moment(startDate).add(7, 'day').format();
  }

  const response: PageCollection = await client
    .api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    .orderby('start/dateTime')
    .top(50)
    .get();

  if (response['@odata.nextLink']) {
    const events: Event[] = [];

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

export async function createEvent(
  accessToken: string,
  event: Event
): Promise<Event[]> {
  const client = getAuthenticatedClient(accessToken);

  const eventResponse = await client
    .api('/me/calendar/events')
    .header('Content-type', 'application/json')
    .post(event);
  return eventResponse;
}

export async function deleteEvent(
  accessToken: string,
  id: string
): Promise<any> {
  const client = getAuthenticatedClient(accessToken);

  return await client.api(`/me/events/${id}`).delete();
}
