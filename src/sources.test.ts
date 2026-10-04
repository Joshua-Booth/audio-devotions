import { describe, it, expect } from "vitest";
import { getDevotions } from "./sources";

describe("getDevotions", () => {
  it("lists the six devotions in playing order", () => {
    expect(getDevotions().map((d) => d.name)).toEqual([
      "Charles Spurgeon - Morning",
      "Charles Spurgeon - Evening",
      "Word For Today",
      "Our Daily Bread",
      "Faith's Checkbook",
      "Micheal Youssef",
    ]);
  });

  it("builds each URL from the zero-padded date", () => {
    const urls = getDevotions(new Date(2026, 2, 9)).map((d) => d.url);

    expect(urls).toEqual([
      "https://stream.biblegateway.com/media/32/morning-and-evening/0309m.mp3",
      "https://stream.biblegateway.com/media/32/morning-and-evening/0309e.mp3",
      "https://resources.vision.org.au/audio/thewordfortoday/20260309.mp3",
      "https://dzxuyknqkmi1e.cloudfront.net/odb/2026/03/odb-03-09-26.mp3",
      "https://mp3.sermonaudio.com/filearea/fcb0309/fcb0309.mp3",
      "https://web.audio.ltw.org/2026/ltw20260308.mp3",
    ]);
  });

  it("dates today's sources today and delayed sources yesterday", () => {
    const today = new Date(2026, 9, 4);
    const dates = getDevotions(today).map((d) => d.date.toDateString());

    expect(dates.slice(0, 5)).toEqual(Array(5).fill(today.toDateString()));
    expect(dates[5]).toBe(new Date(2026, 9, 3).toDateString());
  });

  it("files a delayed recording under the year it's for", () => {
    const [, , , , , youssef] = getDevotions(new Date(2027, 0, 1));
    expect(youssef?.url).toBe("https://web.audio.ltw.org/2026/ltw20261231.mp3");
  });
});
