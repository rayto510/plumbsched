import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { register } from "@/utils/api/auth";
import RegisterScreen from "@/components/ui/RegisterScreen";

jest.mock("@/utils/api/auth");

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input fields and button", () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Register")).toBeTruthy();
  });

  it("shows alert if username or password is empty", () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Register"));

    expect(alertSpy).toHaveBeenCalledWith("Please enter username and password");

    alertSpy.mockRestore();
  });

  it("calls register API and onRegisterSuccess on success", async () => {
    (register as jest.Mock).mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "newuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "newpass");
    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("newuser", "newpass");
    });
  });

  it("shows alert on registration failure", async () => {
    (register as jest.Mock).mockRejectedValueOnce(new Error("Register failed"));

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "newuser");
    fireEvent.changeText(getByPlaceholderText("Password"), "newpass");
    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Registration failed",
        "Register failed"
      );
    });

    alertSpy.mockRestore();
  });
});
