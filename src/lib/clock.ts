const formatters = new Map<string, Intl.DateTimeFormat>();

/** `14:32:07` in the given IANA time zone. */
export function formatClock(date: Date | number, timeZone: string): string {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    formatters.set(timeZone, formatter);
  }
  return formatter.format(date);
}
