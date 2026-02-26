import React from "react";
import { AuthProvider } from "./Context/AuthContext";
import AppRouter from "./routes";

const App = () => {
    
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
