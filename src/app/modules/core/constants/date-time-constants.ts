import * as moment from 'moment';

export const dateTimeConstants = {
  DateFormat: 'dd.MM.yyyy',
  DateWithDayOfWeekFormat: 'dd.MM.yyyy [E]',
  DateTimeFormat: 'dd.MM.yyyy HH:mm',
  MomentDateFormat: 'DD.MM.yyyy',
};

export abstract class DateTime {
  public static get Now(): moment.Moment {
    return moment();
  }

  public static get Today(): moment.Moment {
    return this.Now.startOf('date');
  }

  public static moment(date?: Date): moment.Moment {
    return moment(date);
  }

  public static format(
    value: moment.Moment | Date,
    format: string = null
  ): string {
    if (!value) {
      return null;
    }
    return moment(value)?.format(format ?? dateTimeConstants.MomentDateFormat);
  }

  public static diff(
    value1: moment.Moment | Date,
    value2: moment.Moment | Date,
    unitOfTime: moment.unitOfTime.Diff,
    precise: boolean = false
  ): number {
    return moment(value1).diff(moment(value2), unitOfTime, precise);
  }

  public static endOfDay(date: moment.Moment | Date): Date {
    if (!date) {
      return null;
    }
    const result = moment(date).toDate();
    result.setHours(23, 59, 59, 999);
    return result;
  }

  public static parse(date: string, format: string): Date {
    if (!date) {
      return null;
    }
    const m = moment(date, format);
    return m.toDate();
  }

  public static get birthDatesRangeStartDate(): Date {
    return new Date(1968, 1, 1);
  }

  public static max(d1: Date, d2: Date): Date {
    if (!d1 || !d2) {
      return null;
    }
    return d1.getTime() > d2.getTime() ? d1 : d2;
  }

  public static min(d1: Date, d2: Date): Date {
    if (!d1 || !d2) {
      return null;
    }
    return d1.getTime() < d2.getTime() ? d1 : d2;
  }

  public static get minDate(): Date {
    return new Date(1000, 1, 1);
  }

  public static get maxDate(): Date {
    return new Date(2500, 12, 31);
  }
}
