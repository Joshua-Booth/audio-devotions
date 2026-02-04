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

    const playPauseButton = canvas.getByRole("button", {
      name: "Toggle Play/Pause",
    });

    // Initially should show play icon
    expect(playPauseButton.querySelector(".fa-play")).toBeInTheDocument();
    expect(playPauseButton.querySelector(".fa-pause")).not.toBeInTheDocument();

    // Click to play
    await userEvent.click(playPauseButton);

    // Should now show pause icon (playing state)
    await waitFor(() => {
      expect(playPauseButton.querySelector(".fa-pause")).toBeInTheDocument();
      expect(playPauseButton.querySelector(".fa-play")).not.toBeInTheDocument();
    });

    // Click to pause
    await userEvent.click(playPauseButton);

    // Should show play icon again
    await waitFor(() => {
      expect(playPauseButton.querySelector(".fa-play")).toBeInTheDocument();
      expect(
        playPauseButton.querySelector(".fa-pause")
      ).not.toBeInTheDocument();
    });
  },
};

export const StopButton: Story = {
  tags: ["!dev"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const playPauseButton = canvas.getByRole("button", {
      name: "Toggle Play/Pause",
    });
    const stopButton = canvas.getByRole("button", { name: "Stop" });

    // Start playing
    await userEvent.click(playPauseButton);

    await waitFor(() => {
      expect(playPauseButton.querySelector(".fa-pause")).toBeInTheDocument();
    });

    // Click stop
    await userEvent.click(stopButton);

    // Should show play icon (stopped state)
    await waitFor(() => {
      expect(playPauseButton.querySelector(".fa-play")).toBeInTheDocument();
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
    expect(forwardButton).toHaveClass("hide");
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
    const dateElement = canvas.getByRole("heading", { level: 2 });
    expect(dateElement.textContent).not.toBe(todayStr);
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
    const canvas = within(canvasElement);

    // Verify the audio element exists with a source
    await waitFor(() => {
      const audioElement = canvas.getByRole("main").querySelector("audio");
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

    // Click to change colour
    await userEvent.click(colourButton);

    // Body style should have changed
    await waitFor(() => {
      expect(document.body.style.color).toBe("white");
      expect(document.body.style.backgroundColor).toBe("black");
    });

    // Click again to revert
    await userEvent.click(colourButton);

    await waitFor(() => {
      expect(document.body.style.color).toBe("black");
      expect(document.body.style.backgroundColor).toBe("white");
    });
  },
};
