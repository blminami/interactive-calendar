import { Event } from 'microsoft-graph';
import React from 'react';
import { createEvent } from '../../services/GraphService';
import './EventsForm.scss';
import '@finastra/switch';
import '@material/mwc-formfield';
import moment from 'moment-timezone';
import { config } from '../../Config';

interface EventFormProps {
  getAccessToken: any;
  user: any;
  navigateToCalendar: any;
}

interface EventFormState {
  subject: string;
  body: string;
  startDate: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  location: string;
  attendees: string;
  notification: string;
}

export default class EventsForm extends React.Component<
  EventFormProps,
  EventFormState
> {
  constructor(props: any) {
    super(props);

    this.saveEvent = this.saveEvent.bind(this);
    this.mapStateToEventObj = this.mapStateToEventObj.bind(this);
    this.discard = this.discard.bind(this);
  }

  async saveEvent() {
    const accessToken = await this.props.getAccessToken(config.scopes);
    const event = this.mapStateToEventObj();
    await createEvent(accessToken, event as Event);
    this.props.navigateToCalendar();
  }

  handleInputFieldChange(event: any, field: string) {
    let value = event.target.value;
    if (field === 'isAllDay') {
      value = !this.state?.isAllDay;
    }
    this.setState({ [field]: value } as any);
  }

  mapStateToEventObj() {
    const currentEvent = { ...this.state };
    let startDate = currentEvent.startDate;
    let endDate = currentEvent.startDate;

    if (currentEvent.isAllDay) {
      startDate = `${currentEvent.startDate}T00:00`;
      const startDatePlusOne = moment(currentEvent.startDate, 'YYYY-MM-DD')
        .add(1, 'day')
        .format('YYYY-MM-DD');
      endDate = `${startDatePlusOne}T00:00`;
    }

    if (currentEvent.startTime) {
      startDate = `${currentEvent.startDate}T${currentEvent.endTime}`;
    }
    if (currentEvent.endTime) {
      endDate = `${currentEvent.startDate}T${currentEvent.endTime}`;
    }

    const newEvent = {
      subject: currentEvent.subject,
      body: {
        contentType: 'text',
        content: currentEvent.body
      },
      start: {
        dateTime: startDate,
        timeZone: this.props.user.timeZone
      },
      end: {
        dateTime: endDate,
        timeZone: this.props.user.timeZone
      },
      location: { displayName: currentEvent.location },
      attendees: currentEvent.attendees?.split(',').map((attendee) => {
        return { emailAddress: { address: attendee }, type: 'required' };
      }),
      isAllDay: currentEvent.isAllDay,
      reminderMinutesBeforeStart: +currentEvent.notification,
      isReminderOn: true
    };
    return newEvent;
  }

  discard() {
    this.props.navigateToCalendar();
  }

  render() {
    return (
      <div className='events-form-container fds-subtitle-2'>
        Calendar ({this.props.user.email})
        <div className='input-form'>
          <mwc-icon-button icon='edit'></mwc-icon-button>
          <input
            className='input-field'
            placeholder='New event'
            onChange={($event) =>
              this.handleInputFieldChange($event, 'subject')
            }
          ></input>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='person_add'></mwc-icon-button>
          <input
            className='input-field'
            placeholder='Add people'
            onChange={($event) =>
              this.handleInputFieldChange($event, 'attendees')
            }
          ></input>
        </div>
        <div className='time-slot'>
          <mwc-icon-button icon='access_time'></mwc-icon-button>
          <div className='time-inputs'>
            <input
              className='input-field date-picker'
              type='date'
              onChange={($event) =>
                this.handleInputFieldChange($event, 'startDate')
              }
            ></input>
            <mwc-formfield label='All day'>
              <fds-switch
                onClick={($event: any) =>
                  this.handleInputFieldChange($event, 'isAllDay')
                }
              ></fds-switch>
            </mwc-formfield>
            {!this.state || !this.state?.isAllDay ? (
              <>
                <input
                  className='input-field time-picker'
                  disabled={this.state?.isAllDay}
                  type='time'
                  onChange={($event) =>
                    this.handleInputFieldChange($event, 'startTime')
                  }
                ></input>
                <span>to</span>
                <input
                  className='input-field time-picker'
                  disabled={this.state?.isAllDay}
                  type='time'
                  onChange={($event) =>
                    this.handleInputFieldChange($event, 'endTime')
                  }
                ></input>
              </>
            ) : null}
          </div>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='location_on'></mwc-icon-button>
          <input
            className='input-field'
            placeholder='Location'
            onChange={($event) =>
              this.handleInputFieldChange($event, 'location')
            }
          ></input>
        </div>
        <div className='input-form notification'>
          <mwc-icon-button icon='notifications_none'></mwc-icon-button>
          <input
            className='input-field'
            maxLength={3}
            placeholder='120'
            onChange={($event) =>
              this.handleInputFieldChange($event, 'notification')
            }
          ></input>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='subject'></mwc-icon-button>
          <textarea
            rows={7}
            className='input-field notes'
            placeholder='Add notes'
            onChange={($event) => this.handleInputFieldChange($event, 'body')}
          ></textarea>
        </div>
        <div className='form-actions'>
          <fds-button
            label='Discard'
            outlined
            secondary
            onClick={this.discard}
          ></fds-button>
          <fds-button
            label='Save'
            secondary
            onClick={this.saveEvent}
          ></fds-button>
        </div>
      </div>
    );
  }
}
