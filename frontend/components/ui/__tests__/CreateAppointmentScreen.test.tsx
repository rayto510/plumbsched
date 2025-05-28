// components/ui/__tests__/CreateAppointmentScreen.test.tsx
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import CreateAppointmentScreen from "../CreateAppointmentScreen";

const mockRouter = {
  push: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.spyOn(Alert, "alert");

jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ value, onChange }) => {
    return <Text testID="mock-datetime-picker">Mock Picker</Text>;
  };
});

describe("CreateAppointmentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = (getByPlaceholderText: any) => {
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "123-456-7890");
    fireEvent.changeText(getByPlaceholderText("100 Main St"), "42 Wallaby Way");
    fireEvent.changeText(getByPlaceholderText("Fix sink"), "Install faucet");
  };

  const renderWithNavigation = () =>
    render(
      <NavigationContainer>
        <CreateAppointmentScreen />
      </NavigationContainer>
    );

  it("submits form successfully and navigates", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Create Appointment"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Appointment created")
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/appointments");
  });

  it("shows error alert when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Invalid data" }),
      })
    ) as jest.Mock;

    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Create Appointment"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        JSON.stringify({ detail: "Invalid data" })
      )
    );
  });

  it("shows network error alert on fetch failure", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network down")));

    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fillForm(getByPlaceholderText);
    fireEvent.press(getByText("Create Appointment"));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        "Network error",
        "Could not connect to backend"
      )
    );
  });

  it("navigates back to appointments on back button press", async () => {
    const { getByText } = renderWithNavigation();
    fireEvent.press(getByText("← Back to Appointments"));
    expect(mockRouter.push).toHaveBeenCalledWith("/appointments");
  });
});
