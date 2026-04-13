import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ListingSearchPage from "./pages/ListingSearchPage.jsx";
import ListingDetailPage from "./pages/ListingDetailPage.jsx";
import CreateListingPage from "./pages/CreateListingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/listings" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/listings" element={<ListingSearchPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />

          <Route
            path="/listings/create"
            element={
              <ProtectedRoute allowedRoles={["landlord"]}>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/listings" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
