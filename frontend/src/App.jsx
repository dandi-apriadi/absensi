import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "layouts/super-admin";
import LecturerLayout from "layouts/lecturer";
import StudentLayout from "layouts/student";
import AuthLayout from "layouts/auth";

const App = () => {
  return (
    <Routes>
      <Route path="admin/*" element={<SuperAdminLayout />} />
      <Route path="lecturer/*" element={<LecturerLayout />} />
      <Route path="student/*" element={<StudentLayout />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default App;
