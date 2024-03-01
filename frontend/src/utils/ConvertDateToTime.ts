export function formatAMPM(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hoursDigits = hours % 12 ? Math.floor(hours / 12) + 1 : 12;
  const minDigits = minutes < 10 ? '0' + minutes : minutes;
  const ampm = hours >= 12 ? 'pm' : 'am';

  const strTime = hoursDigits + ':' + minDigits + ' ' + ampm;

  return strTime;
}
