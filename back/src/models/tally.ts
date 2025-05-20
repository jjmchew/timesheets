import { TimerInfo } from "../types/types.js";
import { format, interval, intervalToDuration, add } from "date-fns";
import type { Duration } from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import type { TZDate } from "@date-fns/tz";

interface TimeSpan {
  start: TZDate;
  end: TZDate;
}

/**
 * Primary exported function
 * - called by tallyRouter
 */
export function tally(timers: TimerInfo[]) {
  const timeSpans: TimeSpan[] = convertTimers(timers);
  const daily = calculateDailyDurations(timeSpans);
  const weekly = calculateWeeklyDurations(daily);
  console.dir(daily);
  console.dir(weekly);
  return twoColumns(
    addHeader("DAILY", formatDurations(daily)),
    addHeader("WEEKLY", formatDurations(weekly)),
  );
}

/**
 * Creates daily totals using date-fns functions
 * - each timer start and end form an interval
 * - each interval is converted to a duration
 * - durations which have the same start date are iteratively added
 *
 * - Note:  This can accommodate start and end being on different days,
 *          but it will allocate the entire interval to the start date.
 */
function calculateDailyDurations(timeSpans: TimeSpan[]) {
  let dailyDurations: Record<string, Duration> = {};
  for (const { start, end } of timeSpans) {
    // each start, end forms an interval
    // - convert that interval to a duration
    const timerDuration = intervalToDuration(interval(start, end));
    // console.log(start, end, timerDuration);

    // use formatted start date as dailyDurations key
    const key = format(start, "dd-LLL-yy");

    // for each day
    // - add duration to existing duration
    // - OR start new duration for a given day
    if (dailyDurations.hasOwnProperty(key)) {
      dailyDurations[key] = addDurations(dailyDurations[key], timerDuration);
    } else {
      dailyDurations[key] = timerDuration;
    }
  }
  return dailyDurations;
}

/**
 * Creates weekly totals using date-fns functions
 * - durations which have the same week number are iteratively added
 */
function calculateWeeklyDurations(
  dailyDurations: Record<string, Duration>,
): Record<string, Duration> {
  const weeklyDurations: Record<string, Duration> = {};
  for (const [key, value] of Object.entries(dailyDurations)) {
    const weekKey = "w " + format(key, "ww");
    if (weeklyDurations.hasOwnProperty(weekKey)) {
      weeklyDurations[weekKey] = addDurations(weeklyDurations[weekKey], value);
    } else {
      weeklyDurations[weekKey] = value;
    }
  }
  return weeklyDurations;
}

/**
 * Adds a simple header for final output
 */
function addHeader(header: string, tallyString: string): string {
  return `${header} tally

${tallyString}`;
}

/**
 * Display text in 2 columns
 * - sets width of each column based on last line in each column
 */
function twoColumns(col1: string, col2: string) {
  let output = "";
  const colArr1 = col1.split("\n");
  const colArr2 = col2.split("\n");
  const colWidth1 = colArr1[colArr1.length - 1].length;
  const colWidth2 = colArr2[colArr2.length - 1].length;

  for (let x = 0; x < Math.max(colArr1.length, colArr2.length); x++) {
    const col1 = colArr1[x] || "";
    const col2 = colArr2[x] || "";
    output += `${col1.padEnd(colWidth1, " ")}        ${col2.padEnd(colWidth2, " ")}\n`;
  }
  return output;
}

/**
 * Helper function to add 2 date-fns Durations
 * - seems to be a common problem solved by others online
 * - date-fns does not have an in-built solution for this
 */
function addDurations(duration1: Duration, duration2: Duration): Duration {
  const baseDate = new Date(0);

  return intervalToDuration({
    start: baseDate,
    end: add(add(baseDate, duration1), duration2),
  });
}

/**
 * Convert UTC dates from sqlite to Mountain Time
 * - all durations calculated in MT
 * - use date-fns/tz to manage timezones
 */
function convertTimers(timers: TimerInfo[]): TimeSpan[] {
  return timers.map((timer: TimerInfo) => {
    return {
      start: new TZDateMini(timer.start_time, "America/Denver"),
      end: new TZDateMini(timer.end_time, "America/Denver"),
    };
  });
}

/**
 * Take Daily or Weekly durations and consolidate into text format
 * - "key : HH:MM:SS" on each line, sorted in descending order
 * - "key" is date (dd-MMM-YY) or week #
 */
function formatDurations(durations: Record<string, any>): string {
  const tally = Object.entries(durations).map(([key, value]) => [
    key,
    getHHMMSS(value),
  ]);

  const output = tally
    .sort(descending)
    .map((arr) => `${arr[0]} : ${arr[1]}`)
    .join(`\n`);

  return output;
}

/**
 * Convert date-fns Duration type to HH:MM:SS string
 * - Duration format is object with possible keys:
 *   {
 *     years?: number, months?: number, weeks?: number, days?: number,
 *     hours?: number, minutes?: number, seconds?: number
 *   }
 */
function getHHMMSS(value: Duration) {
  const pad = (val: number) => val.toString().padStart(2, "0");

  const hours = value?.hours || 0;
  const minutes = value?.minutes || 0;
  const seconds = value?.seconds || 0;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Helper function for descending sort
const descending = (a: string[], b: string[]) => {
  if (a[0] > b[0]) return -1;
  else if (a[0] < b[0]) return 1;
  return 0;
};
