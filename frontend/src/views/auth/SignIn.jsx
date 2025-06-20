import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, reset } from "../../store/slices/authSlice";
import { FcGoogle } from "react-icons/fc";
import { MdFace, MdEmail, MdLock } from "react-icons/md";
import Checkbox from "components/checkbox";
import Swal from 'sweetalert2';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    document.title = "Sign In - Sistem Absensi";

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);  // Handle authentication state
  useEffect(() => {
    console.log("Auth state changed:", { isSuccess, isError, user, message });

    // Check if login was successful and user exists
    if (isSuccess && user) {
      console.log("Login successful:", user);
      console.log("User role:", user.role);

      // Map roles to their respective dashboard routes
      const roleRoutes = {
        "super-admin": "/admin/default",
        "lecturer": "/lecturer/default",
        "student": "/student/default"
      };

      const route = roleRoutes[user.role] || "/admin/default";
      console.log("Navigating to:", route);

      // Navigate first, then reset
      navigate(route);

      // Reset after a small delay to ensure navigation completes
      setTimeout(() => {
        dispatch(reset());
      }, 100);
    }

    if (isError) {
      console.log("Login error:", message);
      // Reset state after showing error
      setTimeout(() => {
        dispatch(reset());
      }, 100);
    }
  }, [isSuccess, isError, user, message, navigate, dispatch]);

  const handleAuth = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    try {
      await dispatch(loginUser({ email: email.trim(), password: password.trim() })).unwrap();
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error?.message || 'Invalid credentials',
        confirmButtonColor: '#3085d6',
        timer: 3000,
        timerProgressBar: true
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="mt-10 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[5vh] w-full max-w-[420px] flex-col items-center md:pl-4 lg:pl-0">
        {/* Header Section with rounded icon */}
        <div className="mb-8 flex items-center">
          <div className="mr-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 p-3.5 shadow-lg">
            <MdFace className="h-full w-full text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">FACE<span className="text-emerald-600">ATTEND</span></h3>
            <p className="text-sm text-gray-500">Sistem Absensi dengan Pengenalan Wajah</p>
          </div>
        </div>

        <div className="mb-7">
          <h4 className="mb-2 text-3xl font-bold text-gray-800">
            Selamat Datang
          </h4>
          <p className="text-gray-600">
            Masuk untuk akses sistem absensi pintu cerdas
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdEmail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                id="email"
                type="email"
                placeholder="nama@institusi.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm text-gray-600">
                Ingat Saya
              </p>
            </div>
            <a
              className="text-sm font-medium text-green-600 hover:text-green-700"
              href="/forgot-password"
            >
              Lupa Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-green-500 to-blue-600 py-3 text-base font-medium text-white shadow-md transition duration-200 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Masuk...</span>
              </div>
            ) : (
              "Masuk"
            )}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-medium text-gray-500">ATAU</span>
            </div>
          </div>

          {/* SSO Login */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none"
          >
            <FcGoogle className="h-5 w-5" />
            <span className="text-sm font-medium">Login dengan SSO Institusi</span>
          </button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum memiliki akun?{" "}
              <a
                href="#"
                className="font-medium text-green-600 hover:underline"
              >
                Hubungi administrator
              </a>
            </p>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 text-center text-xs text-gray-500">
            Sistem Absensi Pintu Cerdas dengan Pengenalan Wajah{" "}
            <a href="/terms" className="text-green-600 hover:underline">Ketentuan</a> dan{" "}
            <a href="/privacy" className="text-green-600 hover:underline">Kebijakan Privasi</a>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;