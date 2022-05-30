import moment, { Moment } from 'moment-timezone';

export interface MonthItem {
  day: string;
  month: string;
  date: Moment;
}

export enum CalendarMode {
  'Week' = 'WEEK',
  'Month' = 'MONTH'
}

export function getDate(type: CalendarMode) {
  return moment()
    .clone()
    .startOf(type.toLowerCase() as moment.unitOfTime.StartOf);
}

export function isSameDate(date1: Moment, date2: Moment) {
  return (
    date1.format('D') === date2.format('D') &&
    date1.format('MM') === date2.format('MM')
  );
}

function createDaysForCurrentMonth(date: Moment) {
  return [
    ...Array.from({ length: date.daysInMonth() }, (_, index) => {
      return {
        day: date.clone().add(index, 'days').format('D'),
        date: date.clone().add(index, 'days'),
        month: 'current'
      };
    })
  ];
}

function createDaysForNextMonth(date: Moment) {
  const lastDayOfTheMonth = date.clone().endOf('month');
  const lastDayOfTheMonthWeekday = lastDayOfTheMonth.weekday();

  const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;

  return [...Array(visibleNumberOfDaysFromNextMonth)].map((_, index) => {
    return {
      day: lastDayOfTheMonth
        .clone()
        .add(index + 1, 'day')
        .format('D'),
      date: lastDayOfTheMonth.clone().add(index + 1, 'day'),
      month: 'next'
    };
  });
}

function createDaysForPreviousMonth(date: Moment) {
  const firstDayOfTheMonthWeekday = date.weekday();

  return [...Array(firstDayOfTheMonthWeekday)]
    .map((_, index) => {
      return {
        day: date
          .clone()
          .subtract(index + 1, 'day')
          .format('D'),
        date: date.clone().subtract(index + 1, 'day'),
        month: 'previous'
      };
    })
    .reverse();
}

function createDaysForCurrentWeek(date: Moment) {
  return [...Array(7)].map((_, index) => {
    return {
      day: date.clone().add(index, 'day').format('D'),
      date: date.clone().add(index, 'day'),
      month: 'current'
    };
  });
}

export function getCalendar(type: CalendarMode, startDate: Moment): any[] {
  const days = [];

  switch (type) {
    case CalendarMode.Month:
      const daysInCurrentMonth = createDaysForCurrentMonth(startDate);
      const daysInPreviousMonth = createDaysForPreviousMonth(startDate);
      const daysInNextMonth = createDaysForNextMonth(startDate);
      days.push(
        ...daysInPreviousMonth,
        ...daysInCurrentMonth,
        ...daysInNextMonth
      );
      break;
    case CalendarMode.Week:
      const daysInCurrentWeek = createDaysForCurrentWeek(startDate);
      days.push(...daysInCurrentWeek);
      break;
  }

  return days;
}
