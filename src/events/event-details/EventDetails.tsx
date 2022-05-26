import { Event } from 'microsoft-graph';
import React from 'react';
import './EventDetails.scss';
import '@finastra/switch';
import '@material/mwc-formfield';
import moment from 'moment-timezone';

interface EventDetailsProps {
  event: Event;
  navigateBack: any;
}

interface EventDetailsState {
  event: any;
}

export default class EventDetails extends React.Component<
  EventDetailsProps,
  EventDetailsState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      event: this.mapGraphEventToState()
    };

    console.log('event: ', props.event);
  }

  mapGraphEventToState() {
    const initialStartDate = this.props.event?.start?.dateTime;
    const initialEndDate = this.props.event?.end?.dateTime;

    const startDate = moment(initialStartDate).format('dddd MMMM D, YYYY');
    const endDate = moment(initialEndDate).format('dddd MMMM D, YYYY');
    const startTime = moment(initialStartDate).format('LT');
    const endTime = moment(initialEndDate).format('LT');
    const timeDiff = moment(initialEndDate).diff(initialStartDate, 'hours');

    return {
      ...this.props.event,
      startDate,
      endDate,
      startTime,
      endTime,
      timeDiff
    };
  }

  render() {
    const event = { ...this.state.event };
    return (
      <div className='event-details-container'>
        <div className='event-details-header'>
          <mwc-icon-button
            icon='chevron_left'
            onClick={this.props.navigateBack}
          ></mwc-icon-button>
          <span className='fds-subtitle-1'>{event.subject}</span>
          <mwc-icon-button icon='delete_outline'></mwc-icon-button>
        </div>
        <div className='event-date-details fds-body-1'>
          <span>{event.startDate}</span>
          <span>
            {event.startTime} - {event.endTime} ({event.timeDiff} hours)
          </span>
        </div>
        <fds-divider class='divider'></fds-divider>

        {event.bodyPreview ? (
          <>
            <div className='body-preview fds-body-2'>{event.bodyPreview}</div>
            <fds-divider class='divider'></fds-divider>
          </>
        ) : null}

        {event.reminderMinutesBeforeStart ? (
          <div className='details fds-body-2'>
            <mwc-icon-button icon='notifications_none'></mwc-icon-button>
            <span>{event.reminderMinutesBeforeStart} minutes before </span>
          </div>
        ) : null}

        {event.location ? (
          <div className='details fds-body-2'>
            <mwc-icon-button icon='location_on'></mwc-icon-button>
            <span>{event.location?.displayName}</span>
          </div>
        ) : null}

        {event.attendees?.map((attendee: any, i: number) => {
          return (
            <div key={i} className='attendee fds-body-2'>
              <div className='avatar'>
                {attendee.emailAddress?.address[0].toUpperCase()}
              </div>
              <span>{attendee.emailAddress?.address}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
