/**
 * https://stackoverflow.com/questions/51814581/datepicker-always-show-day-1
 *
 * set date without timezone
 *
 * @param d - js Date Object
 */
export function timezoneOffset(d: Date): Date {
  d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
  return d;
}
