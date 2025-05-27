import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import LoginScreen from "../LoginScreen"; // Adjust the path based on your folder structure

describe("LoginScreen", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login screen UI", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockOnLogin} />
    );

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("calls onLogin with email and password", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockOnLogin} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Log In"));

    expect(mockOnLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("shows alert if email or password is empty", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByText } = render(<LoginScreen onLogin={mockOnLogin} />);
    fireEvent.press(getByText("Log In"));

    expect(alertSpy).toHaveBeenCalledWith("Please enter email and password");
  });
});
