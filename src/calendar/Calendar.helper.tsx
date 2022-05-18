import moment, { Moment } from 'moment-timezone';

export interface MonthItem {
  day: string;
  month: string;
  date: Moment;
}

export function getDate(type: 'week' | 'month') {
  return moment().clone().startOf(type);
}

export function isSameDate(date1: Moment, date2: Moment) {
  return (
    date1.format('D') === date2.format('D') &&
    date1.format('MM') === date2.format('MM')
  );
}

export function createDaysForCurrentMonth(date: Moment) {
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

export function createDaysForNextMonth(date: Moment) {
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

export function createDaysForPreviousMonth(date: Moment) {
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
