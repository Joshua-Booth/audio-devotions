/**
 * @module utils
 */

function dateFromDay(year: number, day: number) {
  const date = new Date(year, 0); // initialise a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

function formatPeriod(period: number) {
  if (period < 10) {
    return `0${period.toString()}`;
  } else {
    return period.toString();
  }
}

interface DateInfo {
  /** The current year (e.g. 2021) */
  year: number;
  /** The shortened current year (e.g. "21") */
  shortYear: string;
  /** The current month, zero-padded (e.g. "03") */
  month: string;
  /** Today's day number, zero-padded (e.g. "29") */
  day: string;
  /** Date string (e.g. "2021-3-29") */
  date: string;
  /** Yesterday's day number, zero-padded (e.g. "28") */
  dayBehindToday: string;
  /** Yesterday's month number, zero-padded (e.g. "03") */
  dayBehindMonth: string;
}

/**
 * Generate and return date information.
 * @returns The current date data
 */
export function getDate(): DateInfo {
  const today = new Date();

  const year = today.getFullYear();
  const shortYear = year.toString().slice(-2);
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const date = `${year}-${month}-${day}`;

  // For devotionals one day behind
  const start = new Date(today.getFullYear(), 0, 0);
  const startDate =
    (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;

  const diff = today.getTime() - start.getTime() + startDate;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / MS_PER_DAY);

  const dayBehindDate = dateFromDay(year, dayOfYear - 1);
  const dayBehindToday = dayBehindDate.getDate();
  const dayBehindMonth = dayBehindDate.getMonth() + 1;

  return {
    year,
    shortYear,
    month: formatPeriod(month),
    day: formatPeriod(day),
    date,
    dayBehindToday: formatPeriod(dayBehindToday),
    dayBehindMonth: formatPeriod(dayBehindMonth),
  };
}

/**
 * Get a list of source urls.
 * @example
 * getSources()
 * @returns List of source urls
 */
export function getSources() {
  const { year, shortYear, month, day, dayBehindToday, dayBehindMonth } =
    getDate();

  return [
    `https://stream.biblegateway.com/media/32/morning-and-evening/${month}${day}m.mp3`,
    `https://stream.biblegateway.com/media/32/morning-and-evening/${month}${day}e.mp3`,
    `https://resources.vision.org.au/audio/thewordfortoday/${year}${month}${day}.mp3`,
    `https://dzxuyknqkmi1e.cloudfront.net/odb/${year}/${month}/odb-${month}-${day}-${shortYear}.mp3`,
    `https://mp3.sermonaudio.com/filearea/fcb${month}${day}/fcb${month}${day}.mp3`,
    `http://web.audio.ltw.org/${year}/ltw${year}${dayBehindMonth}${dayBehindToday}.mp3`,
  ];
}

/**
 * Get a list of source names.
 * @example
 * getSourceNames()
 * @returns List of source names
 */
export function getSourceNames() {
  return [
    "Charles Spurgeon - Morning",
    "Charles Spurgeon - Evening",
    "Word For Today",
    "Our Daily Bread",
    "Faith's Checkbook",
    "Micheal Youssef",
  ];
}

/**
 * Get a list of source names that are delayed by more than a day.
 * @example
 * getDelayedSourceNames()
 * @returns List of delayed source names
 */
export function getDelayedSourceNames() {
  return ["Micheal Youssef"];
}

/**
 * Initialize theme based on localStorage or system preference.
 * Should be called before React renders to avoid flash of wrong theme.
 * @example
 * initializeTheme()
 */
export function initializeTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  } else if (stored === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // No preference stored, use system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
}

/**
 * Toggle the colour theme of the app.
 * @example
 * toggleColour()
 */
export function toggleColour() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
