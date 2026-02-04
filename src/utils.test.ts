import { describe, it, expect } from "vitest";
import {
  getDate,
  getSources,
  getSourceNames,
  getDelayedSourceNames,
} from "./utils";

describe("getDate", () => {
  it("returns current date information", () => {
    const result = getDate();
    const today = new Date();

    expect(result.year).toBe(today.getFullYear());
    expect(result.date).toBe(
      `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    );
  });

  it("formats single-digit months with leading zero", () => {
    const result = getDate();
    expect(result.month).toMatch(/^\d{2}$/);
  });

  it("formats single-digit days with leading zero", () => {
    const result = getDate();
    expect(result.day).toMatch(/^\d{2}$/);
  });
});

describe("getSources", () => {
  it("returns an array of 6 audio URLs", () => {
    const sources = getSources();
    expect(sources).toHaveLength(6);
    sources.forEach((url) => {
      expect(url).toContain(".mp3");
    });
  });
});

describe("getSourceNames", () => {
  it("returns an array of 6 source names", () => {
    const names = getSourceNames();
    expect(names).toHaveLength(6);
    expect(names[0]).toBe("Charles Spurgeon - Morning");
    expect(names[5]).toBe("Micheal Youssef");
  });
});

describe("getDelayedSourceNames", () => {
  it("returns Micheal Youssef as delayed source", () => {
    const delayed = getDelayedSourceNames();
    expect(delayed).toContain("Micheal Youssef");
  });
});

// toggleColour is tested in Storybook (ChangeColourTheme story) since it requires DOM
