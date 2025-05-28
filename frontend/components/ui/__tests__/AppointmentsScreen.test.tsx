// components/ui/__tests__/AppointmentsScreen.test.tsx
import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import AppointmentsScreen from "../AppointmentsScreen";

// Shared mock router instance for consistency
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

// Mock expo-router's useRouter to return the above instance
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

// Mock Alert
jest.spyOn(Alert, "alert");

// Mock fetch globally to return one appointment
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          customer_name: "John Doe",
          address: "123 Main St",
          scheduled_time: "2025-06-01T10:00:00Z",
        },
      ]),
  })
) as jest.Mock;

// Helper to wrap component with NavigationContainer
const renderWithNavigation = () => {
  return render(
    <NavigationContainer>
      <AppointmentsScreen />
    </NavigationContainer>
  );
};

describe("AppointmentsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders appointments after fetch", async () => {
    const { getByText } = renderWithNavigation();
    const name = await waitFor(() => getByText("John Doe"));
    expect(name).toBeTruthy();
    expect(getByText("123 Main St")).toBeTruthy();
    expect(getByText(/2025/)).toBeTruthy(); // Basic check for formatted date
  });

  it("navigates to appointment detail on press", async () => {
    const { getByText } = renderWithNavigation();
    await waitFor(() => getByText("John Doe"));
    fireEvent.press(getByText("John Doe"));
    expect(mockRouter.push).toHaveBeenCalledWith("/appointments/1");
  });

  it("shows alert and navigates on logout", async () => {
    const { getByText } = renderWithNavigation();
    await waitFor(() => getByText("Logout"));
    fireEvent.press(getByText("Logout"));

    // Simulate pressing the "OK" button in Alert
    const onPress = (Alert.alert as jest.Mock).mock.calls[0][2][0].onPress;
    onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      "Logout",
      "You have been logged out.",
      expect.any(Array)
    );
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });
});
