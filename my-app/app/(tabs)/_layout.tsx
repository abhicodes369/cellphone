// _layout.tsx
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function () {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      initialRouteName="home" // Add this line to set initial route
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={Colors.light.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="table" color={Colors.light.icon} />
          ),
        }}
      />
    </Tabs>
  );
}
