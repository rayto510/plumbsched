import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { login } from "@/utils/api/auth";
import LoginScreen from "@/components/ui/LoginScreen";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/api/auth");

describe("LoginScreen", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    jest.clearAllMocks();
  });

  const mockRouterPush = jest.fn();

  it('navigates to register screen when "Don\'t have an account? Register" is pressed', () => {
    const { getByText } = render(<LoginScreen />);

    // Find the clickable register text
    const registerText = getByText("Don't have an account? Register");

    // Simulate press
    fireEvent.press(registerText);

    // Assert router.push called with "/register"
    expect(mockRouterPush).toHaveBeenCalledWith("/register");
  });

  it("renders input fields and buttons", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log In")).toBeTruthy();
  });

  it("shows alert if username or password is empty", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Log In"));

    expect(alertSpy).toHaveBeenCalledWith("Please enter username and password");

    alertSpy.mockRestore();
  });

  it("calls login API and onLoginSuccess on successful login", async () => {
    (login as jest.Mock).mockResolvedValueOnce({ access: "token" });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "testpass");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("testuser", "testpass");
    });
  });

  it("shows alert on login failure", async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error("Failed"));

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Login failed", "Failed");
    });

    alertSpy.mockRestore();
  });
});
