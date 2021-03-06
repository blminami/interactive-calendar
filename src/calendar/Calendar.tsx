import React from 'react';
import moment, { Moment } from 'moment-timezone';
import { Event } from 'microsoft-graph';
import { config } from '../Config';
import { deleteEvent, getUserCalendar } from '../services/GraphService';
import withAuthProvider, { AuthComponentProps } from '../services/AuthProvider';
import './Calendar.scss';
import {
  CalendarMode,
  getCalendar,
  getDate,
  isSameDate,
  MonthItem
} from './Calendar.helper';
import EventsForm from '../events/events-form/EventsForm';
import EventsTimeline from '../events/events-timeline/EventsTimeline';
import EventDetails from '../events/event-details/EventDetails';

interface CalendarState {
  eventsLoaded: boolean;
  events: Event[];
  startOfWeek: Moment | undefined;
  startOfMonth: Moment | undefined;
  days: MonthItem[];
  type: CalendarMode;
  time: Moment;
  displayCalendar: boolean;
  displayEventDetails: boolean;
  currentEvent: Event | undefined;
  selectedDay: Moment;
}

class Calendar extends React.Component<AuthComponentProps, CalendarState> {
  intervalID: any;

  constructor(props: any) {
    super(props);

    this.updateMonth = this.updateMonth.bind(this);
    this.switchView = this.switchView.bind(this);
    this.toggleEventDetails = this.toggleEventDetails.bind(this);

    this.state = {
      eventsLoaded: false,
      events: [],
      days: [],
      startOfWeek: undefined,
      startOfMonth: undefined,
      type: CalendarMode.Week,
      time: moment(),
      displayCalendar: true,
      displayEventDetails: false,
      selectedDay: moment()
    } as any;
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  async componentDidUpdate() {
    if (this.props.user && !this.state.eventsLoaded) {
      try {
        const events = await this.getUserEvents(
          getDate(this.state.type),
          this.state.type
        );

        this.setState({
          eventsLoaded: true,
          events: events,
          startOfWeek: getDate(CalendarMode.Week),
          startOfMonth: getDate(CalendarMode.Month)
        });
        this.getCalendar();
      } catch (err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
    }
  }

  async getUserEvents(date: Moment, type: CalendarMode) {
    const accessToken = await this.props.getAccessToken(config.scopes);
    const events = await getUserCalendar(
      accessToken,
      this.props.user.timeZone,
      date.clone().utc(),
      type
    );
    return events;
  }

  getCalendar() {
    const startDate =
      this.state.type === CalendarMode.Month
        ? this.state.startOfMonth
        : this.state.startOfWeek;
    const days = getCalendar(this.state.type, startDate as Moment);

    this.setState({
      days
    });
  }

  async updateMonth(op: string) {
    const newMonth =
      op === 'add'
        ? this.state.startOfMonth?.clone().add(1, 'months')
        : this.state.startOfMonth?.clone().subtract(1, 'months');

    const events = await this.getUserEvents(
      newMonth as Moment,
      CalendarMode.Month
    );

    this.setState(
      {
        events,
        startOfMonth: newMonth,
        type: CalendarMode.Month,
        selectedDay: moment()
      },
      () => {
        this.getCalendar();
      }
    );
  }

  async switchView(mode: CalendarMode) {
    const newDate = getDate(mode);
    const events = await this.getUserEvents(newDate, mode);
    const stateToUpdate =
      mode === CalendarMode.Week ? 'startOfWeek' : 'startOfMonth';

    const newState = {
      events,
      type: mode,
      selectedDay: moment(),
      [stateToUpdate]: newDate
    };

    this.setState(newState as any, () => {
      this.getCalendar();
    });
  }

  tick() {
    this.setState({
      time: moment()
    });
  }

  toggleCalendarView(newValue: boolean, newEvent?: Event) {
    const events = this.state.events;
    if (newEvent) {
      events.push(newEvent);
    }
    this.setState({
      displayCalendar: newValue,
      displayEventDetails: false,
      events
    });
  }

  toggleEventDetails(newValue: boolean, id?: string) {
    const currentEvent = id
      ? this.state.events.find((event) => event.id === id) || {}
      : {};
    this.setState({
      displayEventDetails: newValue,
      currentEvent
    });
  }

  getEventsForSelectedDay() {
    return this.state.events.filter((event: any) =>
      isSameDate(event.date.start, this.state.selectedDay)
    );
  }

  onSelectedDayChange(newDay: Moment) {
    this.setState({
      selectedDay: newDay
    });
  }

  async deleteEvent(id: string) {
    const accessToken = await this.props.getAccessToken(config.scopes);
    await deleteEvent(accessToken, id);
    const events = this.state.events;
    this.setState({
      displayEventDetails: false,
      events: events.filter((event) => event.id !== id)
    });
  }

  render() {
    return (
      <div className='interactive-calendar-wrapper'>
        <ClockDisplay today={this.state.time} />

        <div className='calendar'>
          <div className='calendar-header'>
            <CalendarHeader
              startOfMonth={this.state.startOfMonth}
              displayArrows={this.state.displayCalendar}
              updateMonth={(op: string) => this.updateMonth(op)}
              toggleCalendarView={(op: boolean) => this.toggleCalendarView(op)}
            />
          </div>
          {this.state.displayCalendar ? (
            <>
              <div
                className={`calendar-body ${
                  this.state.type === CalendarMode.Month ? 'month-view' : ''
                }`}
              >
                <ol>
                  <DayNameItems />
                  <DayItems
                    days={this.state.days}
                    selectedDay={this.state.selectedDay}
                    events={this.state.events}
                    onSelectedDayChange={(date: Moment) =>
                      this.onSelectedDayChange(date)
                    }
                  />
                </ol>
                <CalendarSwitchMode
                  type={this.state.type}
                  startOfMonth={this.state.startOfMonth}
                  switchView={(mode: CalendarMode) => this.switchView(mode)}
                />
              </div>
              {this.state.displayEventDetails ? (
                <EventDetails
                  event={this.state.currentEvent}
                  navigateBack={() => this.toggleEventDetails(false)}
                  deleteEvent={(id: string) => this.deleteEvent(id)}
                />
              ) : (
                <EventsTimeline
                  events={this.getEventsForSelectedDay()}
                  navigateToEvent={(id: string) =>
                    this.toggleEventDetails(true, id)
                  }
                />
              )}
            </>
          ) : (
            <EventsForm
              getAccessToken={this.props.getAccessToken}
              user={this.props.user}
              navigateToCalendar={(newEvent: Event) =>
                this.toggleCalendarView(true, newEvent)
              }
            />
          )}
        </div>
      </div>
    );
  }
}

export default withAuthProvider(Calendar);

const ClockDisplay = (props: any) => {
  const hour = props.today.format('hh:mm a').toUpperCase();
  const day = props.today.format('dddd');
  const month = props.today.format('MMM DD, yyyy').toUpperCase();
  return (
    <div className='clock-container fds-elevation-3'>
      <div className='clock-display '>
        <span className='hour'>{hour}</span>
        <div className='day fds-subtitle-2'>
          <span>{day}</span>
          <span>{month}</span>
        </div>
      </div>
      <div className='clock-display-actions'>
        <mwc-icon-button icon='calendar_today'></mwc-icon-button>
        <mwc-icon-button icon='notifications_none'></mwc-icon-button>
        <mwc-icon-button icon='chat_bubble_outline'></mwc-icon-button>
        <mwc-icon-button icon='error_outline'></mwc-icon-button>
      </div>
    </div>
  );
};

const CalendarHeader = (props: any) => {
  const month = props.startOfMonth?.format('MMMM');
  const day = moment().format('dddd').toUpperCase();
  const isSameMonth = month === moment().format('MMMM');
  return (
    <>
      <span className='fds-subtitle-2 month'>{month}</span>
      <span className='fds-subtitle-2'>{isSameMonth ? day : ''}</span>
      <div className='header-action'>
        {props.displayArrows ? (
          <>
            <mwc-icon-button
              icon='chevron_left'
              onClick={() => props.updateMonth('subtract')}
            ></mwc-icon-button>
            <mwc-icon-button
              icon='chevron_right'
              onClick={() => props.updateMonth('add')}
            ></mwc-icon-button>
          </>
        ) : null}
        <mwc-icon-button
          icon='add'
          onClick={() => props.toggleCalendarView(false)}
        ></mwc-icon-button>
        <mwc-icon-button icon='more_vert'></mwc-icon-button>
      </div>
    </>
  );
};

const DayNameItems = () => {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weekDaysItems = weekDays.map((weekDay: string, index: number) => {
    return (
      <li key={weekDay + index} className='day-name'>
        {weekDay}
      </li>
    );
  });
  return <>{weekDaysItems}</>;
};

const DayItems = (props: any) => {
  const daysItems = props.days.map((data: any, index: number) => {
    const isSelectedDay =
      props.selectedDay.format('DD MMMM YYYY') ===
      data.date.format('DD MMMM YYYY');

    const hasEvents = props.events.some(
      (event: any) =>
        isSameDate(event.date.start, data.date) ||
        isSameDate(event.date.end, data.date)
    );

    return (
      <li
        key={data.day + index}
        className={`${data.month} ${isSelectedDay ? 'selected' : ''}`}
        onClick={() => props.onSelectedDayChange(data.date)}
      >
        <div className='day-wrapper'>
          {data.day}
          {hasEvents ? <span className='dot'></span> : <></>}
        </div>
      </li>
    );
  });
  return <>{daysItems}</>;
};

const CalendarSwitchMode = (props: any) => {
  const month = props.startOfMonth?.format('MMMM');
  const isSameMonth = month === moment().format('MMMM');
  if (!isSameMonth) return <></>;
  return props.type === CalendarMode.Week ? (
    <mwc-icon-button
      class='arrow-icon'
      icon='expand_more'
      onClick={() => props.switchView(CalendarMode.Month)}
    ></mwc-icon-button>
  ) : (
    <mwc-icon-button
      class='arrow-icon'
      icon='expand_less'
      onClick={() => props.switchView(CalendarMode.Week)}
    ></mwc-icon-button>
  );
};
