import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../LoginScreen";
import { Alert } from "react-native";

describe("LoginScreen", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockOnLogin} />
    );
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("shows alert if email or password is empty", () => {
    const alertMock = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByText } = render(<LoginScreen onLogin={mockOnLogin} />);
    fireEvent.press(getByText("Log In"));

    expect(mockOnLogin).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it("calls onLogin with email and password when both are provided", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockOnLogin} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    fireEvent.press(getByText("Log In"));

    expect(mockOnLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });
});
