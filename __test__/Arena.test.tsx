import { describe } from "node:test";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Arena from "@/app/components/arena";

describe("Arena", () => {
  it("should have a Round: 1 displayed", () => {
    render(<Arena />);
    const heading = screen.getByText(/Round: 1/);
    expect(heading).toBeInTheDocument();
  });
});
