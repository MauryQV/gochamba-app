import { Slot } from "expo-router";
import "../../global.css";
import React from "react";

export default function RootLayout() {
  return (
    <React.Fragment>
      <Slot />
    </React.Fragment>
  );
}
