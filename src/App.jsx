// src/App.jsx - Main App with Routing (Q4 - MERN Integration)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintList from "./pages/ComplaintList";
import ComplaintStatus from "./pages/ComplaintStatus";
import AIAnalysis from "./pages/AIAnalysis";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Route wrapper - redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: "30vh" }}></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/"                         element={<Home />} />
        <Route path="/complaints"               element={<ComplaintList />} />
        <Route path="/submit"                   element={<ComplaintForm />} />
        <Route path="/ai-analysis"              element={<AIAnalysis />} />
        <Route path="/login"                    element={<Login />} />
        <Route path="/register"                 element={<Register />} />

        {/* Protected: Status Update */}
        <Route
          path="/complaints/:id/status"
          element={
            <ProtectedRoute>
              <ComplaintStatus />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
