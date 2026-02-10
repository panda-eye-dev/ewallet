import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ParentDashboard from "./pages/ParentDashboard";
import ChildDashboard from "./pages/ChildDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { userRole } = useAuth();

  return (
    <div className="container">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child"
          element={
            <ProtectedRoute>
              <ChildDashboard />
            </ProtectedRoute>
          }
        />

        {/* After login we’ll redirect based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {userRole === "parent" ? (
                <Navigate to="/parent" replace />
              ) : (
                <Navigate to="/child" replace />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
