import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import AppointmentDetail from "../AppointmentDetailScreen";

// Mock routing
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    back: jest.fn(),
    push: jest.fn(),
  })),
}));

const mockAppointment = {
  id: "123",
  customer_name: "Alice Johnson",
  customer_phone: "555-1234",
  address: "1234 Apple St",
  description: "Plumbing issue",
  scheduled_time: "2025-06-01T10:00:00Z",
};

describe("AppointmentDetailScreen", () => {
  const mockBack = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
      push: mockPush,
    });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "123" });
  });

  it("renders appointment data after fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointment,
    });

    const { getByText } = render(<AppointmentDetail />);

    await waitFor(() => {
      expect(getByText("Appointment Details")).toBeTruthy();
      expect(getByText("Alice Johnson")).toBeTruthy();
      expect(getByText("555-1234")).toBeTruthy();
      expect(getByText("1234 Apple St")).toBeTruthy();
      expect(getByText("Plumbing issue")).toBeTruthy();
    });
  });

  it("alerts and navigates back when fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(
      () =>
        ({
          alert: jest.fn(),
        } as any)
    );

    render(<AppointmentDetail />);

    await waitFor(() => {
      expect(mockBack).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it("handles network error and navigates back", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Network failure"));

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(
      () =>
        ({
          alert: jest.fn(),
        } as any)
    );

    render(<AppointmentDetail />);

    await waitFor(() => {
      expect(mockBack).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it("navigates back to appointments list when back button is pressed", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointment,
    });

    const { getByText } = render(<AppointmentDetail />);
    await waitFor(() => getByText("← Back to Appointments"));

    fireEvent.press(getByText("← Back to Appointments"));
    expect(mockPush).toHaveBeenCalledWith("/appointments");
  });
});
