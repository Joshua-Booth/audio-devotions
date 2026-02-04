import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
    },
  },
  decorators: [
    (Story) => {
      // Apply body classes for Tailwind base styles (matching index.html)
      document.body.classList.add(
        "bg-white",
        "text-black",
        "dark:bg-black",
        "dark:text-white",
        "antialiased",
        "font-sans",
        "m-0"
      );
      return Story();
    },
  ],
};

export default preview;
