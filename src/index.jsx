import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import theme from "./theme";
import { PermissionsProvider } from "./context/PermissionsContext.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackBarProvider";
import { EmpresaProvider } from "./context/EmpresaContext";
import "./api/apiClient.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PermissionsProvider>
          <EmpresaProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </EmpresaProvider>
        </PermissionsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);