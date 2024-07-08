// app/page.tsx
"use client";
import React from "react";

import SignIn from "./auth/page";
import ResponsiveAppBar from "./components/NavbarHome";

export default function Home() {
  return (
    <div>
      <ResponsiveAppBar />
      <SignIn />
    </div>
  );
}
