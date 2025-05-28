import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateAppointmentScreen() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const openPicker = (mode: "date" | "time") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handleDateChange = (_event: any, selected?: Date) => {
    if (selected) {
      setScheduledDate((prev) => {
        const newDate = new Date(prev);
        if (pickerMode === "date") {
          newDate.setFullYear(
            selected.getFullYear(),
            selected.getMonth(),
            selected.getDate()
          );
        } else {
          newDate.setHours(selected.getHours(), selected.getMinutes());
        }
        return newDate;
      });
    }
    setShowPicker(false);
  };

  const handleSubmit = async () => {
    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      address,
      description,
      scheduled_time: scheduledDate.toISOString(),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/appointments/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Appointment created");
        router.push("/appointments");
      } else {
        const error = await response.json();
        Alert.alert("Error", JSON.stringify(error));
      }
    } catch (err) {
      Alert.alert("Network error", "Could not connect to backend");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/appointments")}
      >
        <Text style={styles.backButtonText}>← Back to Appointments</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        New Appointment
      </Text>

      <Text style={{ marginBottom: 4 }}>Customer Name</Text>
      <TextInput
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Jane Doe"
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          marginBottom: 16,
        }}
      />

      <Text style={{ marginBottom: 4 }}>Customer Phone</Text>
      <TextInput
        value={customerPhone}
        onChangeText={setCustomerPhone}
        placeholder="111-222-3333"
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          marginBottom: 16,
        }}
      />

      <Text style={{ marginBottom: 4 }}>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="100 Main St"
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          marginBottom: 16,
        }}
      />

      <Text style={{ marginBottom: 4 }}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Fix sink"
        multiline
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          marginBottom: 16,
          minHeight: 60,
        }}
      />

      <Text style={{ marginBottom: 4 }}>Scheduled Date & Time</Text>

      <Pressable
        onPress={() => openPicker("date")}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 8,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Text>{scheduledDate.toLocaleDateString()}</Text>
      </Pressable>

      <Pressable
        onPress={() => openPicker("time")}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Text>
          {scheduledDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={scheduledDate}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <Button title="Create Appointment" onPress={handleSubmit} />
    </View>
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
