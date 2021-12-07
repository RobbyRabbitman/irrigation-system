export function addToDate(
  date = new Date(),
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliSeconds = 0
) {
  const result = new Date(date);
  result.setFullYear(date.getFullYear() + years);
  result.setMonth(date.getMonth() + months);
  result.setDate(date.getDate() + days);
  result.setHours(date.getHours() + hours);
  result.setMinutes(date.getMinutes() + minutes);
  result.setSeconds(date.getSeconds() + seconds);
  result.setMilliseconds(date.getMilliseconds() + milliSeconds);
  return result;
}
