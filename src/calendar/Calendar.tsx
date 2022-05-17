import React from 'react';
import moment, { Moment } from 'moment-timezone';
import { Event } from 'microsoft-graph';
import { config } from '../Config';
import { getUserWeekCalendar } from '../services/GraphService';
import withAuthProvider, { AuthComponentProps } from '../services/AuthProvider';
import './Calendar.scss';
import {
  createDaysForCurrentMonth,
  createDaysForNextMonth,
  createDaysForPreviousMonth,
  MonthItem
} from './Calendar.helper';

interface CalendarState {
  eventsLoaded: boolean;
  events: Event[];
  startOfWeek: Moment | undefined;
  startOfMonth: Moment | undefined;
  days: MonthItem[];
  type: 'weekly' | 'monthly';
}

class Calendar extends React.Component<AuthComponentProps, CalendarState> {
  constructor(props: any) {
    super(props);

    this.updateMonth = this.updateMonth.bind(this);

    this.state = {
      eventsLoaded: false,
      events: [],
      startOfWeek: undefined,
      startOfMonth: undefined,
      days: [],
      type: 'weekly'
    };
  }

  async componentDidUpdate() {
    if (this.props.user && !this.state.eventsLoaded) {
      try {
        const monthlyEvents = await this.getUserEvents(this.getDate('month'));

        this.setState({
          eventsLoaded: true,
          events: monthlyEvents,
          startOfWeek: this.getDate('week'),
          startOfMonth: this.getDate('month')
        });

        this.getCalendar();
      } catch (err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
    }
  }

  async getUserEvents(date: Moment) {
    const accessToken = await this.props.getAccessToken(config.scopes);
    const events = await getUserWeekCalendar(
      accessToken,
      this.props.user.timeZone,
      date.clone().utc()
    );

    return events;
  }

  getDate(type: 'week' | 'month') {
    return moment().clone().startOf(type);
  }

  getCalendar() {
    const currentMonth = this.state.startOfMonth;
    if (!currentMonth) {
      return;
    }
    const daysInCurrentMonth = createDaysForCurrentMonth(currentMonth);
    const daysInPreviousMonth = createDaysForPreviousMonth(currentMonth);
    const daysInNextMonth = createDaysForNextMonth(currentMonth);

    const days = [
      ...daysInPreviousMonth,
      ...daysInCurrentMonth,
      ...daysInNextMonth
    ];

    this.setState({
      days
    });
  }

  updateMonth(op: 'add' | 'subtract') {
    const newMonth =
      op === 'add'
        ? this.state.startOfMonth?.clone().add(1, 'months')
        : this.state.startOfMonth?.clone().subtract(1, 'months');
    this.setState(
      {
        startOfMonth: newMonth
      },
      () => {
        this.getCalendar();
      }
    );
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
            <DayItems days={this.state.days} />
          </ol>
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
    return (
      <li
        key={data.day + index}
        className={`${data.month} ${isToday ? 'today' : ''}`}
      >
        {data.day}
      </li>
    );
  });
  return <>{daysItems}</>;
};
