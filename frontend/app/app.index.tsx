// app/index.tsx
import { Redirect } from "expo-router";
import { useState } from "react";

export default function Index() {
  const [isLoggedIn] = useState(false); // use real auth state in a real app

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
