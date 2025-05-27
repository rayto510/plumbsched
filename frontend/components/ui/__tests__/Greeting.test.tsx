import React from "react";
import { render } from "@testing-library/react-native";
import Greeting from "../Greeting";

describe("Greeting Component", () => {
  it("renders with the correct name", () => {
    const { getByText } = render(<Greeting name="Plumber" />);
    expect(getByText("Hello, Plumber!")).toBeTruthy();
  });
});
