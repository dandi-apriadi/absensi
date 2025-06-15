import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider dari react-redux
import { store } from './store/index.js';
import SuperAdminLayout from "layouts/super-admin";
import LecturerLayout from "layouts/lecturer";
import StudentLayout from "layouts/student";
import AuthLayout from "layouts/auth";

const App = () => {
  return (
    // Bungkus aplikasi dengan Provider dan berikan store Redux
    <Provider store={store}>
      <Routes>
        <Route path="admin/*" element={<SuperAdminLayout />} />
        <Route path="lecturer/*" element={<LecturerLayout />} />
        <Route path="student/*" element={<StudentLayout />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </Provider>
  );
};

export default App;
