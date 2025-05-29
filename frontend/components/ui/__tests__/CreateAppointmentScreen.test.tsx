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
  const { View, Text } = require("react-native");

  return ({ testID, value, mode, onChange }) => {
    return (
      <View testID={testID || "dateTimePicker"}>
        <Text>{`Mode: ${mode}`}</Text>
        <Text>{`Value: ${value.toISOString()}`}</Text>
      </View>
    );
  };
});

describe("CreateAppointmentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithNavigation = () =>
    render(
      <NavigationContainer>
        <CreateAppointmentScreen />
      </NavigationContainer>
    );

  it("shows empty form initially", () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();
    expect(getByPlaceholderText("Jane Doe").props.value).toBe("");
    expect(getByPlaceholderText("111-222-3333").props.value).toBe("");
    expect(getByPlaceholderText("100 Main St").props.value).toBe("");
    expect(getByPlaceholderText("Fix sink").props.value).toBe("");
    expect(getByText("Create Appointment")).toBeTruthy();
  });

  it("shows 'customer name is required' error on submit with empty name", async () => {
    const { getByText } = renderWithNavigation();
    fireEvent.press(getByText("Create Appointment"));
    await waitFor(() => {
      expect(getByText("Customer name is required")).toBeTruthy();
    });
  });

  it("does not show error when customer name is filled", () => {
    const { getByPlaceholderText, queryByText, getByText } =
      renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.press(getByText("Create Appointment"));
    expect(queryByText("Customer name is required")).toBeNull();
  });

  it("shows 'Phone number is required' error on submit with empty phone", async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.press(getByText("Create Appointment"));
    await waitFor(() => {
      expect(getByText("Phone number is required")).toBeTruthy();
    });
  });

  it("shows 'Phone number must be exactly 10 digits' error on invalid phone", async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "invalid-phone");
    fireEvent.press(getByText("Create Appointment"));
    await waitFor(() => {
      expect(getByText("Phone number must be exactly 10 digits")).toBeTruthy();
    });
  });

  it("does not show error when customer phone is filled", () => {
    const { getByPlaceholderText, queryByText, getByText } =
      renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "1234567890");
    fireEvent.press(getByText("Create Appointment"));
    expect(queryByText("Phone number is required")).toBeNull();
  });

  it("shows 'Address is required' error on submit with empty address", async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "1234567890");
    fireEvent.press(getByText("Create Appointment"));
    await waitFor(() => {
      expect(getByText("Address is required")).toBeTruthy();
    });
  });

  it("does not show error when address is filled", () => {
    const { getByPlaceholderText, queryByText, getByText } =
      renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "1234567890");
    fireEvent.changeText(getByPlaceholderText("100 Main St"), "42 Wallaby Way");
    fireEvent.press(getByText("Create Appointment"));
    expect(queryByText("Address is required")).toBeNull();
  });

  it("shows 'Description is required' error on submit with empty description", async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "1234567890");
    fireEvent.changeText(getByPlaceholderText("100 Main St"), "42 Wallaby Way");
    fireEvent.press(getByText("Create Appointment"));
    await waitFor(() => {
      expect(getByText("Description is required")).toBeTruthy();
    });
  });

  it("does not show error when description is filled", () => {
    const { getByPlaceholderText, queryByText, getByText } =
      renderWithNavigation();
    fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Alice");
    fireEvent.changeText(getByPlaceholderText("111-222-3333"), "1234567890");
    fireEvent.changeText(getByPlaceholderText("100 Main St"), "42 Wallaby Way");
    fireEvent.changeText(getByPlaceholderText("Fix sink"), "Install faucet");
    fireEvent.press(getByText("Create Appointment"));
    expect(queryByText("Description is required")).toBeNull();
  });

  it("navigates back to appointments on back button press", async () => {
    const { getByText } = renderWithNavigation();
    fireEvent.press(getByText("← Back to Appointments"));
    expect(mockRouter.push).toHaveBeenCalledWith("/appointments");
  });
});
