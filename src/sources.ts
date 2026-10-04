/**
 * @module sources
 */

interface DayParts {
  year: number;
  shortYear: string;
  month: string;
  day: string;
}

interface Source {
  name: string;
  daysBehind: number;
  url: (day: DayParts) => string;
}

const SOURCES: Source[] = [
  {
    name: "Charles Spurgeon - Morning",
    daysBehind: 0,
    url: ({ month, day }) =>
      `https://stream.biblegateway.com/media/32/morning-and-evening/${month}${day}m.mp3`,
  },
  {
    name: "Charles Spurgeon - Evening",
    daysBehind: 0,
    url: ({ month, day }) =>
      `https://stream.biblegateway.com/media/32/morning-and-evening/${month}${day}e.mp3`,
  },
  {
    name: "Word For Today",
    daysBehind: 0,
    url: ({ year, month, day }) =>
      `https://resources.vision.org.au/audio/thewordfortoday/${year}${month}${day}.mp3`,
  },
  {
    name: "Our Daily Bread",
    daysBehind: 0,
    url: ({ year, shortYear, month, day }) =>
      `https://dzxuyknqkmi1e.cloudfront.net/odb/${year}/${month}/odb-${month}-${day}-${shortYear}.mp3`,
  },
  {
    name: "Faith's Checkbook",
    daysBehind: 0,
    url: ({ month, day }) =>
      `https://mp3.sermonaudio.com/filearea/fcb${month}${day}/fcb${month}${day}.mp3`,
  },
  {
    name: "Micheal Youssef",
    daysBehind: 1,
    url: ({ year, month, day }) =>
      `https://web.audio.ltw.org/${year}/ltw${year}${month}${day}.mp3`,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

function dayParts(date: Date): DayParts {
  const year = date.getFullYear();
  return {
    year,
    shortYear: String(year).slice(-2),
    month: pad(date.getMonth() + 1),
    day: pad(date.getDate()),
  };
}

export interface Devotion {
  name: string;
  url: string;
  date: Date;
}

export function getDevotions(today = new Date()): Devotion[] {
  return SOURCES.map(({ name, daysBehind, url }) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - daysBehind
    );
    return { name, url: url(dayParts(date)), date };
  });
}
