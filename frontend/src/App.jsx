import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "layouts/super-admin";
import AuthLayout from "layouts/auth";

const App = () => {
  return (
    <Routes>
      <Route path="admin/*" element={<SuperAdminLayout />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default App;
