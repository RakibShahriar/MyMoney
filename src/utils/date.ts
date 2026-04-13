import dayjs from 'dayjs';

import { DATE_STORAGE_FORMAT, MONTH_LABEL_FORMAT } from '@/src/constants/app';

export const getToday = () => dayjs().format(DATE_STORAGE_FORMAT);

export const getCurrentMonth = () => dayjs().month() + 1;

export const getCurrentYear = () => dayjs().year();

export const getMonthLabel = (month: number, year: number) =>
  dayjs(`${year}-${String(month).padStart(2, '0')}-01`).format(MONTH_LABEL_FORMAT);

export const toReadableDate = (value: string) => dayjs(value).format('DD MMM YYYY');

export const toSqlMonthBounds = (month: number, year: number) => {
  const start = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
  return {
    start: start.startOf('month').format(DATE_STORAGE_FORMAT),
    end: start.endOf('month').format(DATE_STORAGE_FORMAT),
  };
};

export const getRecentMonths = (count: number) =>
  Array.from({ length: count }).map((_, index) => {
    const target = dayjs().subtract(count - index - 1, 'month');
    return {
      month: target.month() + 1,
      year: target.year(),
      label: target.format('MMM'),
    };
  });

export const shiftMonth = (month: number, year: number, delta: number) => {
  const shifted = dayjs(`${year}-${String(month).padStart(2, '0')}-01`).add(delta, 'month');

  return {
    month: shifted.month() + 1,
    year: shifted.year(),
  };
};
