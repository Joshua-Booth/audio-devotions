import { describe, it, expect } from "vitest";
import { formatClock, formatSpokenDuration } from "./format";

describe("formatClock", () => {
  it("formats minutes and zero-padded seconds", () => {
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(66.9)).toBe("1:06");
    expect(formatClock(431)).toBe("7:11");
  });

  it("adds hours when needed", () => {
    expect(formatClock(3725)).toBe("1:02:05");
  });

  it("shows a placeholder while the length is unknown", () => {
    expect(formatClock(Number.NaN)).toBe("-:--");
    expect(formatClock(Number.POSITIVE_INFINITY)).toBe("-:--");
  });
});

describe("formatSpokenDuration", () => {
  it("spells out minutes and seconds", () => {
    expect(formatSpokenDuration(431)).toBe("7 minutes 11 seconds");
  });

  it("uses singular units and drops zero minutes", () => {
    expect(formatSpokenDuration(61)).toBe("1 minute 1 second");
    expect(formatSpokenDuration(9)).toBe("9 seconds");
  });
});
