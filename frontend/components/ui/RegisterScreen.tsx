import { register } from "@/utils/api/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("Please enter username and password");
      return;
    }
    setLoading(true);
    try {
      await register(username, password);
      Alert.alert("Registration successful!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Registration failed", error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="next"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={styles.loginLink}
      >
        <Text style={styles.loginLinkHighlight}>
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginLink: {
    marginTop: 25,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#556677",
    fontSize: 16,
  },
  loginLinkHighlight: {
    color: "#2980b9",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#e9f1f7", // same soft blue background
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#2c3e50", // dark slate blue, grounded & friendly
    fontFamily: "System",
  },
  input: {
    height: 50,
    borderColor: "#7f8c8d", // subtle gray-blue border
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "System",
    color: "#34495e", // text color consistent with login
  },
  button: {
    backgroundColor: "#2980b9", // stable deep blue button
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
    backgroundColor: "#85c1e9", // lighter blue disabled state
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "System",
  },
});
