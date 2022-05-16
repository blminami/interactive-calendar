import React from 'react';
import moment, { Moment } from 'moment-timezone';
import { Event } from 'microsoft-graph';
import { config } from '../Config';
import { getUserWeekCalendar } from '../services/GraphService';
import withAuthProvider, { AuthComponentProps } from '../services/AuthProvider';
import './Calendar.scss';

interface CalendarState {
  eventsLoaded: boolean;
  events: Event[];
  startOfWeek: Moment | undefined;
  startOfMonth: Moment | undefined;
  type: 'weekly' | 'monthly';
}

class Calendar extends React.Component<AuthComponentProps, CalendarState> {
  constructor(props: any) {
    super(props);

    this.nextMonth = this.nextMonth.bind(this);

    this.state = {
      eventsLoaded: false,
      events: [],
      startOfWeek: undefined,
      startOfMonth: undefined,
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
    let date;
    switch (type) {
      case 'week':
        date = moment().clone().startOf('week');
        break;
      case 'month':
        date = moment().clone().startOf('month');
        break;
    }

    return date;
  }

  getCalendar() {
    const currentMonth = this.state.startOfMonth;
    if (!currentMonth) {
      return;
    }
    const daysInCurrentMonth = this.createDaysForCurrentMonth(currentMonth);
    // console.log('daysInCurrentMonth', daysInCurrentMonth);

    const daysInPreviousMonth = this.createDaysForPreviousMonth(currentMonth);
    // console.log('daysInPreviousMonth', daysInPreviousMonth);

    const daysInNextMonth = this.createDaysForNextMonth(currentMonth);
    // console.log('daysInNextMonth', daysInNextMonth);

    const days = [
      ...daysInPreviousMonth,
      ...daysInCurrentMonth,
      ...daysInNextMonth
    ];

    console.log('days: ', days);
  }

  createDaysForCurrentMonth(date: Moment) {
    return [
      ...Array.from({ length: date.daysInMonth() }, (_, index) => {
        return date.clone().add(index, 'days').format('DD');
      })
    ];
  }

  createDaysForNextMonth(date: Moment) {
    const lastDayOfTheMonth = date.clone().endOf('month');
    const lastDayOfTheMonthWeekday = lastDayOfTheMonth.weekday();

    const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((_, index) => {
      return lastDayOfTheMonth
        .clone()
        .add(index + 1, 'day')
        .format('DD');
    });
  }

  createDaysForPreviousMonth(date: Moment) {
    const firstDayOfTheMonthWeekday = date.weekday();

    return [...Array(firstDayOfTheMonthWeekday)]
      .map((_, index) => {
        return date
          .clone()
          .subtract(index + 1, 'day')
          .format('DD');
      })
      .reverse();
  }

  nextMonth() {
    const nextMonth = this.state.startOfMonth?.clone().add(1, 'months');
    this.setState(
      {
        startOfMonth: nextMonth
      },
      () => {
        this.getCalendar();
      }
    );
  }

  render() {
    return (
      <div className='calendar'>
        <fds-button label='Next' onClick={this.nextMonth}></fds-button>
      </div>
    );
  }
}

export default withAuthProvider(Calendar);
