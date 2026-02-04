import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Mock HTMLMediaElement.play() to avoid autoplay policy errors in tests
// The browser blocks autoplay without user interaction, causing unhandled rejections
HTMLMediaElement.prototype.play = function () {
  return Promise.resolve();
};

HTMLMediaElement.prototype.pause = function () {
  // No-op for tests
};
