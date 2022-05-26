import { Event } from 'microsoft-graph';
import React from 'react';
import './EventsTimeline.scss';
import '@finastra/switch';
import '@material/mwc-formfield';
import moment from 'moment-timezone';

interface EventsTimelineProps {
  events: Event[];
  navigateToEvents: any;
}

interface EventsTimelineState {
  timeSlots: any;
  eventsLoaded: boolean;
}

const timeSlots = [
  {
    time: '00:00 AM',
    state: 'prev',
    events: []
  },
  {
    time: '01:00 AM',
    state: 'prev'
  },
  { time: '02:00 AM', state: 'prev' },
  { time: '03:00 AM', state: 'prev' },
  { time: '04:00 AM', state: 'prev' },
  { time: '05:00 AM', state: 'prev' },
  { time: '06:00 AM', state: 'prev' },
  { time: '07:00 AM', state: 'prev' },
  { time: '08:00 AM', state: 'prev' },
  { time: '09:00 AM', state: 'prev' },
  { time: '10:00 AM', state: 'prev' },
  { time: '11:00 AM', state: 'prev' },
  { time: '12:00 PM', state: 'prev' },
  { time: '01:00 PM', state: 'prev' },
  { time: '02:00 PM', state: 'prev' },
  { time: '03:00 PM', state: 'prev' },
  { time: '04:00 PM', state: 'prev' },
  { time: '05:00 PM', state: 'prev' },
  { time: '06:00 PM', state: 'prev' },
  { time: '07:00 PM', state: 'prev' },
  { time: '08:00 PM', state: 'prev' },
  { time: '09:00 PM', state: 'prev' },
  { time: '10:00 PM', state: 'prev' },
  { time: '11:00 PM', state: 'prev' }
];

export default class EventsTimeline extends React.Component<EventsTimelineProps> {
  compTimeSlots = [...timeSlots];
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
      const endTime = event.date.end.format('hh:mm A');
      console.log('startTime:', startTime);
      const ev = {
        subject: event.subject,
        startTime,
        endTime,
        startMin: event.date.start.format('mm'),
        diffMin: event.date.end.diff(event.date.start) / 60000
      };
      if (!eventMap[startTime]) {
        eventMap[startTime] = [ev];
      } else {
        eventMap[startTime].push(ev);
      }
    });

    const currentTime = moment().format('hh:mm a').toUpperCase();
    const newTimeSlots: any = [];
    let found = false;
    timeSlots.forEach((timeSlot, index) => {
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
        {this.compTimeSlots.map((timeSlot: any, index: number) => {
          return (
            <div key={index} className='time-slot'>
              <span className='time-slot-value'>{timeSlot.time}</span>
              <div className='event-slot'>
                <fds-divider class='slot-divider'></fds-divider>
                {timeSlot.events?.map((event: any, index: number) => {
                  return (
                    <div
                      key={`event${index}`}
                      className='event'
                      style={{
                        marginTop: +event.startMin + 2,
                        height: +event.diffMin
                      }}
                    >
                      test
                    </div>
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
