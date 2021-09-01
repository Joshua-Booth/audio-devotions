/**
 * @module utils
 */

/**
 * @typedef {Object} Date
 * @property {year} KeyNameHere - Brief description of the key here.
 * @property {number} year The current year (e.g. 2021)
 * @property {string} shortYear The shortend current year (e.g. 21)
 * @property {string} month The current month (e.g. 03)
 * @property {number} day Today's day number (e.g. 29)
 * @property {string} date Date string (e.g. 2021-3-29)
 * @property {number} dayBehindToday Yesterday's day number (e.g. 28)
 * @property {string} dayBehindMonth Yesterday's month number (e.g. 03)
 */

/**
 * Generate and return data information.
 * @returns {Date} The current date data
 */
export const getDate = () => {
  var today = new Date();

  var year = today.getFullYear();
  var shortYear = year.toString().slice(-2);
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var date = year + "-" + month + "-" + day;

  // For devotionals one day behind
  var start = new Date(today.getFullYear(), 0, 0);
  var diff =
    today -
    start +
    (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var dayOfYear = Math.floor(diff / oneDay);

  function dateFromDay(year, day) {
    var date = new Date(year, 0); // initialise a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }

  var dayBehindDate = dateFromDay(year, dayOfYear - 1);
  var dayBehindToday = dayBehindDate.getDate();
  var dayBehindMonth = dayBehindDate.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
    dayBehindMonth = "0" + dayBehindMonth;
  }

  if (day < 10) {
    day = "0" + day;
    dayBehindToday = "0" + dayBehindToday;
  }

  return {
    year,
    shortYear,
    month,
    day,
    date,
    dayBehindToday,
    dayBehindMonth,
  };
};

/**
 * Get a list of source urls.
 * @example
 * getSources()
 * @returns {Array} List of source urls
 */
export const getSources = () => {
  const { year, shortYear, month, day, dayBehindToday, dayBehindMonth } =
    getDate();

  return [
    `https://stream.biblegateway.com/media/32/morning-and-evening/${month}${day}m.mp3`,
    `https://stream.biblegateway.com/media/32/morning-and-evening/${month}${day}e.mp3`,
    `https://resources.vision.org.au/audio/thewordfortoday/${year}${month}${day}.mp3`,
    `https://dzxuyknqkmi1e.cloudfront.net/odb/${year}/${month}/odb-${month}-${day}-${shortYear}.mp3`,
    `https://podcasts.moodyradio.org/TodayintheWordDevotional/${year}-${dayBehindMonth}-${dayBehindToday}_tw_stream.mp3`,
    `https://mp3.sermonaudio.com/filearea/fcb${month}${day}/fcb${month}${day}.mp3`,
    `http://web.audio.ltw.org/${year}/ltw${year}${dayBehindMonth}${dayBehindToday}.mp3`,
  ];
};

/**
 * Get a list of source names.
 * @example
 * getSourceNames()
 * @returns {Array} List of source names
 */
export const getSourceNames = () => {
  return [
    "Charles Spurgeon - Morning",
    "Charles Spurgeon - Evening",
    "Word For Today",
    "Our Daily Bread",
    "Today in the Word",
    "Faith's Checkbook",
    "Micheal Youssef",
  ];
};

/**
 * Get a list of source names that are delayed by more than a day.
 * @example
 * getDelayedSourceNames()
 * @returns {Array} List of delayed source names
 */
export const getDelayedSourceNames = () => {
  return ["Micheal Youssef"];
};

/**
 * Toggle the colour theme of the app.
 * @example
 * toggleColour()
 */
export const toggleColour = () => {
  var bodyStyle = document.body.style;

  if (bodyStyle.color === "white") {
    bodyStyle.color = "black";
    bodyStyle.backgroundColor = "white";
  } else {
    bodyStyle.color = "white";
    bodyStyle.backgroundColor = "black";
  }
};
