import React, { useState, useEffect } from "react"; // Import useEffect
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import api from "./api"; // Import your custom axios instance

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// Main Layout component where the Header will always be present
function MainLayout({ children }) {
  const [username, setUsername] = useState(""); // Initialize state for username

  useEffect(() => {
    // Fetch the username from the API on component mount
    const fetchUsername = async () => {
      try {
        const response = await api.get("/api/user/");
        setUsername(response.data.username); // Set the username in state
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    fetchUsername(); // Call the function to fetch the username
  }, []); // Empty dependency array to run once on mount

  return (
    <div>
      <Header username={username} /> {/* Pass username to the Header */}
      <div>{children}</div> {/* This will render the content of the routes */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/collector"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Game />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
