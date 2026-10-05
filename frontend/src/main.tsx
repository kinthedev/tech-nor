import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Client ID lấy từ file frontend/.env (biến phải có tiền tố VITE_ thì Vite mới đưa ra trình duyệt)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* GoogleOAuthProvider tải script Google Identity Services (accounts.google.com/gsi/client)
        và cung cấp clientId cho mọi component <GoogleLogin /> bên trong */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
