import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { App } from "./app";
import { formatLongDate } from "./format";
import { setYellowOnBlack } from "./theme";

const meta: Meta<typeof App> = {
  component: App,
  parameters: {
    a11y: { test: "error" },
  },
};

export default meta;
type Story = StoryObj<typeof App>;

export const Default: Story = {};

export const YellowOnBlack: Story = {
  beforeEach: () => {
    setYellowOnBlack(true);
    return () => setYellowOnBlack(false);
  },
};

export const StylesAreApplied: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { level: 1 });
    const play = canvas.getByRole("button", { name: "Play" });

    await waitFor(() => {
      expect(getComputedStyle(title).fontWeight).toBe("800");
      expect(getComputedStyle(play).borderTopWidth).toBe("5px");
    });
  },
};

export const PlayPauseToggle: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initially should show Play button
    const playButton = canvas.getByRole("button", { name: "Play" });
    expect(playButton).toBeInTheDocument();

    // Click to play
    await userEvent.click(playButton);

    // Should now show Pause button
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    // Click to pause
    const pauseButton = canvas.getByRole("button", { name: "Pause" });
    await userEvent.click(pauseButton);

    // Should show Play button again
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });
  },
};

export const StopButton: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playButton = canvas.getByRole("button", { name: "Play" });
    const stopButton = canvas.getByRole("button", { name: "Stop" });

    // Start playing
    await userEvent.click(playButton);

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    // Click stop
    await userEvent.click(stopButton);

    // Should show Play button (stopped state)
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });
  },
};

export const NavigateForward: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial title should be "Charles Spurgeon - Morning"
    expect(canvas.getByText("Charles Spurgeon - Morning")).toBeInTheDocument();

    expect(
      canvas.queryByRole("button", { name: "Back" })
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    // Should now show "Charles Spurgeon - Evening"
    await waitFor(() => {
      expect(
        canvas.getByText("Charles Spurgeon - Evening")
      ).toBeInTheDocument();
    });

    expect(canvas.getByRole("button", { name: "Back" })).toBeVisible();
  },
};

export const NavigateBackward: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Navigate forward first
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(
        canvas.getByText("Charles Spurgeon - Evening")
      ).toBeInTheDocument();
    });

    // Navigate backward
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));

    // Should be back to "Charles Spurgeon - Morning"
    await waitFor(() => {
      expect(
        canvas.getByText("Charles Spurgeon - Morning")
      ).toBeInTheDocument();
    });
  },
};

export const NavigateToLastItem: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nextButton = canvas.getByRole("button", { name: "Next" });

    // Navigate through all 6 sources (click forward 5 times)
    for (let i = 0; i < 5; i++) {
      await userEvent.click(nextButton);
    }

    // Should be at "Micheal Youssef"
    await waitFor(() => {
      expect(canvas.getByText("Micheal Youssef")).toBeInTheDocument();
    });

    expect(nextButton).not.toBeVisible();
  },
};

export const DelayedSourceShowsDifferentDate: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Initially shows today's date
    expect(canvas.getByText(formatLongDate(today))).toBeInTheDocument();

    // Navigate to Micheal Youssef (5 clicks forward)
    const nextButton = canvas.getByRole("button", { name: "Next" });
    for (let i = 0; i < 5; i++) {
      await userEvent.click(nextButton);
    }

    await waitFor(() => {
      expect(canvas.getByText("Micheal Youssef")).toBeInTheDocument();
    });

    expect(canvas.getByText(formatLongDate(yesterday))).toBeInTheDocument();
    expect(canvas.queryByText(formatLongDate(today))).not.toBeInTheDocument();
  },
};

export const SeekerInteraction: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const seeker = canvas.getByRole("slider", { name: "Playback position" });

    expect(seeker).toHaveValue("0");
    expect(seeker).toHaveAttribute("min", "0");
    expect(seeker).toHaveAttribute("aria-valuetext");
  },
};

export const AudioElementLoads: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    // Verify the audio element exists with a source
    await waitFor(() => {
      const audioElement = canvasElement.querySelector("audio");
      expect(audioElement).toBeInTheDocument();
      expect(audioElement?.src).toContain(".mp3");
    });
  },
};

export const ShowsMessageWhenRecordingFails: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvasElement.querySelector("audio")).toBeInTheDocument();
    });
    canvasElement.querySelector("audio")!.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(canvas.getByText("Not available yet. Press Next.")).toBeVisible();
    });
    expect(canvas.getByRole("button", { name: "Play" })).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => {
      expect(
        canvas.queryByText("Not available yet. Press Next.")
      ).not.toBeInTheDocument();
    });
  },
};

export const PointsBackWhenLastRecordingFails: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nextButton = canvas.getByRole("button", { name: "Next" });
    for (let i = 0; i < 5; i++) {
      await userEvent.click(nextButton);
    }
    await waitFor(() => {
      expect(canvas.getByText("Micheal Youssef")).toBeInTheDocument();
    });

    canvasElement.querySelector("audio")!.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(canvas.getByText("Not available yet. Press Back.")).toBeVisible();
    });
  },
};

export const StopsWhenRecordingEnds: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Play" }));
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    // The browser pauses the element when a recording finishes
    canvasElement.querySelector("audio")!.dispatchEvent(new Event("pause"));

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });
  },
};

export const FailureDoesNotStartNextRecording: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvasElement.querySelector("audio")).toBeInTheDocument();
    });
    canvasElement.querySelector("audio")!.dispatchEvent(new Event("error"));
    await waitFor(() => {
      expect(canvas.getByText("Not available yet. Press Next.")).toBeVisible();
    });

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Play" })).toBeEnabled();
    });
  },
};

export const KeepsFocusWhenNextHides: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nextButton = canvas.getByRole("button", { name: "Next" });
    for (let i = 0; i < 5; i++) {
      await userEvent.click(nextButton);
    }

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Play" })).toHaveFocus();
    });
  },
};

export const ChangeColourTheme: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const colourButton = canvas.getByRole("button", { name: "Change Colour" });

    // Ensure we start in light mode
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");

    // Click to change to dark mode
    await userEvent.click(colourButton);

    // Document should have dark class
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    // Click again to revert to light mode
    await userEvent.click(colourButton);

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(localStorage.getItem("theme")).toBe("light");
    });
  },
};
