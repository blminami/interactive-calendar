import React from 'react';
import moment, { Moment } from 'moment-timezone';
import { Event } from 'microsoft-graph';
import { config } from '../Config';
import { getUserCalendar } from '../services/GraphService';
import withAuthProvider, { AuthComponentProps } from '../services/AuthProvider';
import './Calendar.scss';
import {
  createDaysForCurrentMonth,
  createDaysForCurrentWeek,
  createDaysForNextMonth,
  createDaysForPreviousMonth,
  getDate,
  isSameDate,
  MonthItem
} from './Calendar.helper';

interface CalendarState {
  eventsLoaded: boolean;
  events: Event[];
  startOfWeek: Moment | undefined;
  startOfMonth: Moment | undefined;
  days: MonthItem[];
  type: 'week' | 'month';
}

class Calendar extends React.Component<AuthComponentProps, CalendarState> {
  constructor(props: any) {
    super(props);

    this.updateMonth = this.updateMonth.bind(this);
    this.switchView = this.switchView.bind(this);

    this.state = {
      eventsLoaded: false,
      events: [],
      days: [],
      startOfWeek: undefined,
      startOfMonth: undefined,
      type: 'month'
    };
  }

  async componentDidUpdate() {
    if (this.props.user && !this.state.eventsLoaded) {
      try {
        const events = await this.getUserEvents(
          getDate('month'),
          this.state.type
        );

        this.setState({
          eventsLoaded: true,
          events: events,
          startOfWeek: getDate('week'),
          startOfMonth: getDate('month')
        });

        this.getCalendar();
      } catch (err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
    }
  }

  async getUserEvents(date: Moment, type: 'week' | 'month') {
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
    const days = [];
    if (this.state.type === 'month') {
      const currentMonth = this.state.startOfMonth;
      const daysInCurrentMonth = createDaysForCurrentMonth(
        currentMonth as Moment
      );
      const daysInPreviousMonth = createDaysForPreviousMonth(
        currentMonth as Moment
      );
      const daysInNextMonth = createDaysForNextMonth(currentMonth as Moment);

      days.push(
        ...daysInPreviousMonth,
        ...daysInCurrentMonth,
        ...daysInNextMonth
      );
    } else {
      const currentWeek = this.state.startOfWeek;
      const daysInCurrentWeek = createDaysForCurrentWeek(currentWeek as Moment);

      days.push(...daysInCurrentWeek);
    }

    this.setState({
      days
    });
  }

  async updateMonth(op: 'add' | 'subtract') {
    const newMonth =
      op === 'add'
        ? this.state.startOfMonth?.clone().add(1, 'months')
        : this.state.startOfMonth?.clone().subtract(1, 'months');

    const events = await this.getUserEvents(newMonth as Moment, 'month');

    this.setState(
      {
        startOfMonth: newMonth,
        events,
        type: 'month'
      },
      () => {
        this.getCalendar();
      }
    );
  }

  async switchView(mode: 'week' | 'month') {
    const newDate = getDate(mode);
    const events = await this.getUserEvents(newDate, mode);
    const stateToUpdate = mode === 'week' ? 'startOfWeek' : 'startOfMonth';

    const newState = {
      [stateToUpdate]: newDate,
      events,
      type: mode
    };

    this.setState(newState as any, () => {
      this.getCalendar();
    });
  }

  render() {
    return (
      <div className='calendar-wrapper'>
        <div className='calendar-actions'>
          <fds-button
            label='Prev'
            outlined
            onClick={() => this.updateMonth('subtract')}
          ></fds-button>
          <fds-button
            label='Next'
            outlined
            onClick={() => this.updateMonth('add')}
          ></fds-button>
        </div>

        <div className='calendar'>
          <div className='calendar-header'>
            <CalendarHeader startOfMonth={this.state.startOfMonth} />
          </div>
          <ol className='calendar-body'>
            <DayNameItems />
            <DayItems days={this.state.days} events={this.state.events} />
          </ol>
          <CalendarSwitchMode
            type={this.state.type}
            startOfMonth={this.state.startOfMonth}
            switchView={(mode: 'week' | 'month') => this.switchView(mode)}
          />
        </div>
      </div>
    );
  }
}

export default withAuthProvider(Calendar);

const CalendarHeader = (props: any) => {
  const month = props.startOfMonth?.format('MMMM');
  const day = moment().format('dddd').toUpperCase();
  const isSameMonth = month === moment().format('MMMM');
  return (
    <>
      <span className='fds-subtitle-2 month'>{month}</span>
      <span className='fds-subtitle-2'>{isSameMonth ? day : ''}</span>
      <div className='header-action'>
        <mwc-icon-button dense icon='add'></mwc-icon-button>
        <mwc-icon-button dense icon='more_vert'></mwc-icon-button>
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
    const isToday = moment(0, 'HH').diff(data.date, 'day') === 0;

    const hasEvents = props.events.some(
      (event: any) =>
        isSameDate(event.date.start, data.date) ||
        isSameDate(event.date.end, data.date)
    );

    return (
      <li
        key={data.day + index}
        className={`${data.month} ${isToday ? 'today' : ''}`}
      >
        <div className='test-div'>
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
  return props.type === 'week' ? (
    <mwc-icon-button
      class='arrow-icon'
      icon='keyboard_arrow_down'
      onClick={() => props.switchView('month')}
    ></mwc-icon-button>
  ) : (
    <mwc-icon-button
      class='arrow-icon'
      icon='keyboard_arrow_up'
      onClick={() => props.switchView('week')}
    ></mwc-icon-button>
  );
};
