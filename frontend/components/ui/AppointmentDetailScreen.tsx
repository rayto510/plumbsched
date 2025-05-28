import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Appointment = {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  description: string;
  scheduled_time: string; // ISO 8601 string
  // add other fields if you have more
};

export default function AppointmentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debugger;
    if (!id) return;

    async function fetchAppointment() {
      try {
        const response = await fetch(
          `http://localhost:8000/appointments/${id}/details/`
        );
        if (response.ok) {
          const data = await response.json();
          setAppointment(data);
        } else {
          Alert.alert("Error", `Appointment not found (id: ${id})`);
          router.back(); // or navigate back to appointments list
        }
      } catch (error) {
        Alert.alert("Network Error", "Failed to fetch appointment");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (!appointment) {
    return null; // or some fallback UI
  }

  // Format date nicely
  const scheduledDate = new Date(appointment.scheduled_time).toLocaleString();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/appointments")}
      >
        <Text style={styles.backButtonText}>← Back to Appointments</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Appointment Details</Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: "700", marginBottom: 5 }}>
          Customer Name:
        </Text>
        <Text style={{ fontSize: 16, color: "#34495e" }}>
          {appointment.customer_name}
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: "700", marginBottom: 5 }}>Phone:</Text>
        <Text style={{ fontSize: 16, color: "#34495e" }}>
          {appointment.customer_phone}
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: "700", marginBottom: 5 }}>Address:</Text>
        <Text style={{ fontSize: 16, color: "#34495e" }}>
          {appointment.address}
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: "700", marginBottom: 5 }}>Description:</Text>
        <Text style={{ fontSize: 16, color: "#34495e" }}>
          {appointment.description}
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: "700", marginBottom: 5 }}>
          Scheduled Time:
        </Text>
        <Text style={{ fontSize: 16, color: "#34495e" }}>{scheduledDate}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#2980b9",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#e9f1f7", // soft light blue for calm, clean feeling
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#2c3e50", // dark slate blue, professional & grounded
    fontFamily: "System", // use system font for familiarity
  },
  subtitle: {
    fontSize: 16,
    color: "#556677", // a soft, approachable gray-blue
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "System",
    lineHeight: 22,
  },
  input: {
    height: 50,
    borderColor: "#7f8c8d", // medium gray with slight blue tint for subtlety
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "System",
    color: "#34495e", // dark gray-blue text
  },
  button: {
    backgroundColor: "#2980b9", // calm, deep blue - trustworthy & solid
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#85c1e9", // lighter blue when disabled
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "System",
  },
  registerLink: {
    marginTop: 25,
    alignItems: "center",
  },
  registerText: {
    color: "#2980b9",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "System",
  },
});
