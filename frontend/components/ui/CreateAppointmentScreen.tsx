import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
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

  // Validation error state
  const [errors, setErrors] = useState<{
    customerName?: string;
    customerPhone?: string;
    address?: string;
    description?: string;
    scheduledDate?: string;
  }>({});

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setDescription("");
    setScheduledDate(new Date());
    setErrors({});
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => {
        // Reset form when screen is unfocused
        resetForm();
      };
    }, [])
  );

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

  // Validate inputs, return true if valid, false if errors
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (
      !/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(customerPhone.trim())
    ) {
      newErrors.customerPhone = "Invalid phone number format";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!scheduledDate || scheduledDate <= new Date()) {
      newErrors.scheduledDate = "Scheduled date & time must be in the future";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

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
        onChangeText={(text) => {
          setCustomerName(text);
          if (errors.customerName)
            setErrors((e) => ({ ...e, customerName: undefined }));
        }}
        placeholder="Jane Doe"
        style={[styles.input, errors.customerName && styles.inputError]}
      />
      {errors.customerName && (
        <Text style={styles.errorText}>{errors.customerName}</Text>
      )}

      <Text style={{ marginBottom: 4 }}>Customer Phone</Text>
      <TextInput
        value={customerPhone}
        onChangeText={(text) => {
          setCustomerPhone(text);
          if (errors.customerPhone)
            setErrors((e) => ({ ...e, customerPhone: undefined }));
        }}
        placeholder="111-222-3333"
        keyboardType="phone-pad"
        style={[styles.input, errors.customerPhone && styles.inputError]}
      />
      {errors.customerPhone && (
        <Text style={styles.errorText}>{errors.customerPhone}</Text>
      )}

      <Text style={{ marginBottom: 4 }}>Address</Text>
      <TextInput
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          if (errors.address) setErrors((e) => ({ ...e, address: undefined }));
        }}
        placeholder="100 Main St"
        style={[styles.input, errors.address && styles.inputError]}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      <Text style={{ marginBottom: 4 }}>Description</Text>
      <TextInput
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          if (errors.description)
            setErrors((e) => ({ ...e, description: undefined }));
        }}
        placeholder="Fix sink"
        multiline
        style={[
          styles.input,
          styles.textarea,
          errors.description && styles.inputError,
        ]}
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}

      <Text style={{ marginBottom: 4 }}>Scheduled Date & Time</Text>

      <Pressable
        onPress={() => openPicker("date")}
        style={[styles.datePicker, errors.scheduledDate && styles.inputError]}
      >
        <Text>{scheduledDate.toLocaleDateString()}</Text>
      </Pressable>

      <Pressable
        onPress={() => openPicker("time")}
        style={[styles.datePicker, errors.scheduledDate && styles.inputError]}
      >
        <Text>
          {scheduledDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Pressable>

      {errors.scheduledDate && (
        <Text style={[styles.errorText, { marginBottom: 16 }]}>
          {errors.scheduledDate}
        </Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={scheduledDate}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()} // prevent selecting past date/time on iOS/Android
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
    backgroundColor: "#e9f1f7",
  },
  input: {
    height: 50,
    borderColor: "#7f8c8d",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "System",
    color: "#34495e",
  },
  textarea: {
    minHeight: 60,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 12,
    fontWeight: "500",
  },
  datePicker: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
});
