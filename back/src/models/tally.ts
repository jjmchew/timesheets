import { TimerInfo } from "../types/types.js";
import { format, interval, intervalToDuration, add, Duration } from "date-fns";
import { TZDate } from "@date-fns/tz";

interface TimeSpan {
  start: TZDate;
  end: TZDate;
}

function addDurations(duration1: Duration, duration2: Duration) {
  const baseDate = new Date(0);

  return intervalToDuration({
    start: baseDate,
    end: add(add(baseDate, duration1), duration2),
  });
}

function calculateElapsedTime(timeSpans: TimeSpan[]) {
  let result: Record<string, any> = {};
  for (const { start, end } of timeSpans) {
    // each start, end forms an interval
    // - convert that interval to a duration
    const timerDuration = intervalToDuration(interval(start, end));
    // console.log(start, end, timerDuration);

    // use formatted start date as result key
    const key = format(start, "dd-LLL-yy");

    // for each day
    // - add duration to existing duration
    // - OR start new duration for a given day
    if (result.hasOwnProperty(key)) {
      result[key] = addDurations(result[key], timerDuration);
    } else {
      result[key] = timerDuration;
    }
  }
  return result;
}

export function tally(timers: TimerInfo[]) {
  console.log("tally");
  const timeSpans: TimeSpan[] = convertTimers(timers);
  const result = calculateElapsedTime(timeSpans);
  console.dir(result);
  return result;
}

function convertTimers(timers: TimerInfo[]): TimeSpan[] {
  // convert UTC dates to MT (for elapsed time)
  return timers.map((timer: TimerInfo) => {
    return {
      start: new TZDate(timer.start_time, "America/Denver"),
      end: new TZDate(timer.end_time, "America/Denver"),
    };
  });
}
