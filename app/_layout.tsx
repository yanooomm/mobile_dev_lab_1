import { Stack } from "expo-router";
import React from "react";
import { MarkersProvider } from "../context/MarkersContext";

export default function Layout() {
  return (
    <MarkersProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Карта" }} />
        <Stack.Screen name="marker/[id]" options={{ title: "Детали маркера" }} />
      </Stack>
    </MarkersProvider>
  );
}
