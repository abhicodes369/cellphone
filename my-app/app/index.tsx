// app/index.tsx (create this file)
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  return <Redirect href="/home" />;
}
