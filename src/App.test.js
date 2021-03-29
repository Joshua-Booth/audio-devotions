import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";

// Component
import App from "./App";

test("renders today's date", () => {
  const { getByText } = render(<App />);

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  const dateElement = getByText(`${year}-${month}-${day}`);
  expect(dateElement).toBeInTheDocument();
});

test("should have no accessibility violations", async () => {
  render(<App />);
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});
