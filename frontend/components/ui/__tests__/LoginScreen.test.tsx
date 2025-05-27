import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { login } from "@/utils/api/auth";
import LoginScreen from "@/components/ui/LoginScreen";

jest.mock("@/utils/api/auth");

describe("LoginScreen", () => {
  const onLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input fields and buttons", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLoginSuccess={onLoginSuccess} />
    );

    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("shows alert if username or password is empty", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByText } = render(
      <LoginScreen onLoginSuccess={onLoginSuccess} />
    );
    fireEvent.press(getByText("Log In"));

    expect(alertSpy).toHaveBeenCalledWith("Please enter username and password");

    alertSpy.mockRestore();
  });

  it("calls login API and onLoginSuccess on successful login", async () => {
    (login as jest.Mock).mockResolvedValueOnce({ access: "token" });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLoginSuccess={onLoginSuccess} />
    );

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "testpass");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("testuser", "testpass");
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });

  it("shows alert on login failure", async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error("Failed"));

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLoginSuccess={onLoginSuccess} />
    );

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Login failed", "Failed");
    });

    alertSpy.mockRestore();
  });
});
