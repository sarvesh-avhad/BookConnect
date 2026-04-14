import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { GamificationProvider } from "./context/GamificationContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here"}>
      <AuthProvider>
        <ToastProvider>
          <GamificationProvider>
            <App />
          </GamificationProvider>
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
