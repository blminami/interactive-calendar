import { Event } from 'microsoft-graph';
import React from 'react';
import './EventsTimeline.scss';
import '@finastra/switch';
import '@material/mwc-formfield';
import moment from 'moment-timezone';
import { timeSlotsConfig } from './EventTimeline.helper';

interface EventsTimelineProps {
  events: Event[];
  navigateToEvent: any;
}

export default class EventsTimeline extends React.Component<EventsTimelineProps> {
  compTimeSlots = [...timeSlotsConfig];

  constructor(props: any) {
    super(props);
  }

  componentDidUpdate() {
    this.formatData();
  }

  formatData() {
    const eventMap: any = {};
    this.props.events?.forEach((event: any) => {
      const startTime = event.date.start.format('hh:mm A');
      const startTimeOfInterval = event.date.start.format('hh:00 A');
      const endTime = event.date.end.format('hh:mm A');
      const ev = {
        subject: event.subject,
        startMin: event.date.start.format('mm'),
        diffMin: event.date.end.diff(event.date.start) / 60000,
        startTime,
        endTime,
        id: event.id
      };
      if (!eventMap[startTimeOfInterval]) {
        eventMap[startTimeOfInterval] = [ev];
      } else {
        eventMap[startTimeOfInterval].push(ev);
      }
    });

    const currentTime = moment().format('hh:mm a').toUpperCase();
    const newTimeSlots: any = [];
    let found = false;
    this.compTimeSlots.forEach((timeSlot, index) => {
      timeSlot.events = eventMap[timeSlot.time];
      const beginningTime = moment(timeSlot.time, 'h:mma');
      const endTime = moment(currentTime, 'h:mma');
      if (beginningTime.isBefore(endTime)) {
        newTimeSlots.push(timeSlot);
      } else {
        if (!found) {
          newTimeSlots[index - 1].state = 'current';
          found = true;
        }
        newTimeSlots.push({ ...timeSlot, state: 'next' });
      }
    });

    this.compTimeSlots = newTimeSlots;
  }

  render() {
    return (
      <div className='events-timeline-container fds-subtitle-2'>
        {this.compTimeSlots.map((timeSlot: any) => {
          return (
            <div key={timeSlot.time} className='time-slot'>
              <span className='time-slot-value'>{timeSlot.time}</span>
              <div className='event-slot'>
                <fds-divider class='slot-divider'></fds-divider>
                {timeSlot.events?.map((event: any) => {
                  return (
                    <EventItem
                      key={event.id}
                      timeSlot={timeSlot}
                      event={event}
                      navigateToEvent={(id: string) =>
                        this.props.navigateToEvent(id)
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const EventItem = (props: any) => {
  return (
    <div
      className={`event  ${props.timeSlot.state}`}
      style={{
        marginTop: +props.event.startMin + 2,
        height: +props.event.diffMin + 14
      }}
      onClick={() => props.navigateToEvent(props.event.id)}
    >
      <span className='event-time fds-caption'>
        {props.event.startTime} - {props.event.endTime}
      </span>
      <span className='fds-subtitle-1'>{props.event.subject}</span>
    </div>
  );
};
