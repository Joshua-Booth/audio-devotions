import { render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";

// Component
import App from "./App";


it("renders today's date", () => {
  const { getByText } = render(<App />);

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  const dateElement = getByText(`${year}-${month}-${day}`);
  expect(dateElement).toBeInTheDocument();
});

it("should have no accessibility violations", async () => {
  render(<App />);
  
  waitFor(async () => {
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  })
});
