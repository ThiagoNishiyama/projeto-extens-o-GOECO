import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/30 relative">
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-emerald-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-blue-100/30 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />
      </div>

      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
