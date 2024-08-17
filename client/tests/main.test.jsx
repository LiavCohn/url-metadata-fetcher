import { it, expect, describe, beforeAll } from "vitest";
import { render, screen ,fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/vitest"
import React from "react";
import App from "../src/App.jsx"; 

beforeAll(() => {
  render(<App />);

})

describe("App Component", () => {
  it("renders without crashing", () => {
    const header = screen.getByRole("heading")
    expect(header).toBeInTheDocument()
  });

  it("should show the Loader component when submitting 3 URLs", () => {
    const addUrlButton = screen.getByText(/Add URL/i);
    expect(addUrlButton).toBeInTheDocument()
    fireEvent.click(addUrlButton);
    fireEvent.click(addUrlButton);
    fireEvent.click(addUrlButton);

    // // Find all URL input fields by their class name
    const deleteButtons = document.getElementsByClassName("delete-button")
    // // Check that there are exactly 3 URL input fields
    expect(deleteButtons).toHaveLength(3);
    fireEvent.click(deleteButtons[0])

    expect(deleteButtons).toHaveLength(2);

  });

  it("should have a submit button initially disabled with fewer than 3 URLs", () => {
    screen.debug()
    const submitButton = screen.getByText(/Submit/i);

    expect(submitButton).toBeDisabled();
  });
});
