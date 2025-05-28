import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Appointment = {
  id: number;
  customer_name: string;
  address: string;
  scheduled_time: string;
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:8000/appointments/");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  // Simple logout handler
  const handleLogout = () => {
    // TODO: Clear auth tokens/state here if you have any
    // For now, just navigate to login
    Alert.alert("Logout", "You have been logged out.", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upcoming Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/appointments/${item.id}`)}
            style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ccc" }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.customer_name}</Text>
            <Text>{item.address}</Text>
            <Text>{new Date(item.scheduled_time).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/appointments/new")}
        style={styles.newButton}
      >
        <Text style={styles.newButtonText}>+ New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#c0392b", // red for logout
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  newButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
