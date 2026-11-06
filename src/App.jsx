// App.js
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AppRoutes from "./routes/Route";  // Importa el archivo de rutas

function App() {
  return (
     <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppRoutes />
    </LocalizationProvider>
  );
}

export default App;
