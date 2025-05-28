import { API_BASE_URL } from "@/utils/config";
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
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/appointments/`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchAppointments();
    } catch (err) {
      Alert.alert("Error", "Failed to delete appointment.");
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete", "Are you sure you want to delete this appointment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAppointment(id),
      },
    ]);
  };

  const handleLogout = () => {
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
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ccc",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => router.push(`/appointments/${item.id}`)}
            >
              <Text style={{ fontWeight: "bold" }}>{item.customer_name}</Text>
              <Text>{item.address}</Text>
              <Text>{new Date(item.scheduled_time).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#e9f1f7",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#2c3e50",
    fontFamily: "System",
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#c0392b",
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
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
