import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import App from "./App";

const meta: Meta<typeof App> = {
  component: App,
  parameters: {
    a11y: { test: "error" },
  },
};

export default meta;
type Story = StoryObj<typeof App>;

export const Default: Story = {};

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

    const forwardButton = canvas.getByRole("button", { name: "Skip Forward" });

    // Navigate forward
    await userEvent.click(forwardButton);

    // Should now show "Charles Spurgeon - Evening"
    await waitFor(() => {
      expect(
        canvas.getByText("Charles Spurgeon - Evening")
      ).toBeInTheDocument();
    });

    // Backward button should now be visible
    const backwardButton = canvas.getByRole("button", {
      name: "Skip Backward",
    });
    expect(backwardButton).toBeVisible();
  },
};

export const NavigateBackward: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const forwardButton = canvas.getByRole("button", { name: "Skip Forward" });

    // Navigate forward first
    await userEvent.click(forwardButton);

    await waitFor(() => {
      expect(
        canvas.getByText("Charles Spurgeon - Evening")
      ).toBeInTheDocument();
    });

    const backwardButton = canvas.getByRole("button", {
      name: "Skip Backward",
    });

    // Navigate backward
    await userEvent.click(backwardButton);

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

    const forwardButton = canvas.getByRole("button", { name: "Skip Forward" });

    // Navigate through all 6 sources (click forward 5 times)
    // 1. Charles Spurgeon - Morning (start)
    // 2. Charles Spurgeon - Evening
    // 3. Word For Today
    // 4. Our Daily Bread
    // 5. Faith's Checkbook
    // 6. Micheal Youssef (last)

    for (let i = 0; i < 5; i++) {
      await userEvent.click(forwardButton);
    }

    // Should be at "Micheal Youssef"
    await waitFor(() => {
      expect(canvas.getByText("Micheal Youssef")).toBeInTheDocument();
    });

    // Forward button should be hidden (at last item)
    expect(forwardButton).toHaveClass("invisible");
  },
};

export const DelayedSourceShowsDifferentDate: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const forwardButton = canvas.getByRole("button", { name: "Skip Forward" });

    // Get today's date for comparison
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // Initially shows today's date
    expect(canvas.getByText(todayStr)).toBeInTheDocument();

    // Navigate to Micheal Youssef (5 clicks forward)
    for (let i = 0; i < 5; i++) {
      await userEvent.click(forwardButton);
    }

    await waitFor(() => {
      expect(canvas.getByText("Micheal Youssef")).toBeInTheDocument();
    });

    // Date should be different (yesterday) for delayed source
    // The date element should NOT show today's date
    const dateElement = canvasElement.querySelector("p");
    expect(dateElement?.textContent).not.toBe(todayStr);
  },
};

export const SeekerInteraction: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const seeker = canvas.getByRole("slider", { name: "Seeker" });

    // Initial value should be 0
    expect(seeker).toHaveValue("0");

    // Simulate seeking - fire change event
    await userEvent.click(seeker);

    // The seeker should be interactive
    expect(seeker).toBeEnabled();
    expect(seeker).toHaveAttribute("min", "0");
    expect(seeker).toHaveAttribute("max", "0.999999");
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
