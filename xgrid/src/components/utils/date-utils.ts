import { format } from "date-fns";

export function convertDate(inputFormat: Date) {
  if (!inputFormat) {
    return null;
  } else {
    return inputFormat.toLocaleDateString();
  }
}

export function DateToDateTimeString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export function DateToString(Date: Date) {
  return format(Date, "yyyy-MM-dd");
}

export function makeDates(date: Date, dateEnd: Date): Date[] {
  const res = [];
  const dt = new Date(date);
  while (dt.getTime() <= dateEnd.getTime()) {
    res.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return res;
}

export function clearTime(date: Date) {
  const result = new Date(date);
  result.setHours(0);
  result.setMinutes(0);
  result.setSeconds(0);
  result.setMilliseconds(0);
  return result;
}
