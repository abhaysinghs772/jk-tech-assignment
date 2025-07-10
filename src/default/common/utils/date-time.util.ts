import {
  format as formatDate,
  parse as parseDate,
  formatDistanceToNow,
} from 'date-fns';
import { toZonedTime, format as formatWithTZ } from 'date-fns-tz';
import { enUS, fr, de } from 'date-fns/locale';

export class DateTimeUtil {
  /**
   * Formats a date object into a string based on the given format, locale, and optional time zone.
   *
   * @param date The date object or string to format.
   * @param format The format string (e.g., 'yyyy-MM-dd HH:mm:ss').
   * @param locale The locale for formatting (default: 'enUS').
   * @param timeZone Optional time zone (e.g., 'America/New_York').
   * @returns The formatted date string.
   */
  static format(
    date: Date | string,
    format: string = 'yyyy-MM-dd HH:mm:ss',
    locale: string = 'enUS',
    timeZone?: string,
  ): string {
    const locales = { enUS, fr, de }; // Add more locales as needed
    const localeConfig = locales[locale] || enUS;

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (timeZone) {
      const zonedDate = toZonedTime(dateObj, timeZone);
      return formatWithTZ(zonedDate, format, { locale: localeConfig });
    }

    return formatDate(dateObj, format, { locale: localeConfig });
  }

  /**
   * Parses a date string into a Date object based on the given format.
   *
   * @param dateString The date string to parse.
   * @param format The expected format of the date string.
   * @returns A Date object or null if parsing fails.
   */
  static parse(dateString: string, format: string): Date | null {
    try {
      return parseDate(dateString, format, new Date());
    } catch (error) {
      console.error('Failed to parse date:', error);
      return null;
    }
  }

  /**
   * Gets the current date and time as a formatted string.
   *
   * @param format The format string for the output (default: 'yyyy-MM-dd HH:mm:ss').
   * @param locale The locale for formatting (default: 'enUS').
   * @param timeZone Optional time zone.
   * @returns The formatted current date-time string.
   */
  static now(
    format: string = 'yyyy-MM-dd HH:mm:ss',
    locale: string = 'enUS',
    timeZone?: string,
  ): string {
    return this.format(new Date(), format, locale, timeZone);
  }

  /**
   * Adds or subtracts days, months, or years to/from a given date.
   *
   * @param date The base date.
   * @param options An object specifying the units to add or subtract:
   * - days: Number of days.
   * - months: Number of months.
   * - years: Number of years.
   * @returns The modified Date object.
   */
  static addOrSubtract(
    date: Date,
    options: { days?: number; months?: number; years?: number },
  ): Date {
    const { days = 0, months = 0, years = 0 } = options;

    const updatedDate = new Date(date);
    updatedDate.setDate(updatedDate.getDate() + days);
    updatedDate.setMonth(updatedDate.getMonth() + months);
    updatedDate.setFullYear(updatedDate.getFullYear() + years);

    return updatedDate;
  }

  /**
   * Converts a date into a human-readable relative time string (e.g., '2 days ago').
   *
   * @param date The date to compare with the current date.
   * @param locale The locale for formatting (default: 'enUS').
   * @returns A relative time string (e.g., "2 hours ago").
   */
  static toRelativeTime(date: Date | string, locale: string = 'enUS'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: enUS });
  }

  /**
   * Calculates the time gap between now and a provided date-time string.
   *
   * @param timeString The input date-time string.
   * @param options Custom thresholds for time units.
   * @returns A human-readable time gap (e.g., "2h", "3d", "1w").
   */
  static getTimeGap(
    timeString: string,
    options?: {
      customThresholds?: { day?: number; week?: number };
      locale?: string;
    },
  ): string {
    const { customThresholds = {}, locale = 'enUS' } = options || {};
    const currentTime: Date = new Date();
    const providedTime: Date = new Date(timeString);

    const timeDifference: number =
      providedTime.getTime() - currentTime.getTime();

    // Get thresholds
    const millisecondsPerDay =
      (customThresholds.day || 1) * 1000 * 60 * 60 * 24;
    const millisecondsPerWeek =
      (customThresholds.week || 7) * millisecondsPerDay;

    const absoluteTimeDifference = Math.abs(timeDifference);

    if (absoluteTimeDifference < millisecondsPerDay) {
      const hours = Math.floor(absoluteTimeDifference / (1000 * 60 * 60));
      return `${hours}h`;
    } else if (absoluteTimeDifference < millisecondsPerWeek) {
      const days = Math.floor(absoluteTimeDifference / millisecondsPerDay);
      return `${days}d`;
    } else {
      const weeks = Math.floor(absoluteTimeDifference / millisecondsPerWeek);
      return `${weeks}w`;
    }
  }

  /**
   * Calculates a human-readable duration between two dates.
   *
   * @param startDate The start date.
   * @param endDate The end date.
   * @returns A duration string (e.g., "2h 30m").
   */
  static calculateDuration(
    startDate: Date | string,
    endDate: Date | string,
  ): string {
    const start =
      typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const totalMinutes = Math.abs(
      (end.getTime() - start.getTime()) / (1000 * 60),
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours}h ${minutes}m`;
  }
}
