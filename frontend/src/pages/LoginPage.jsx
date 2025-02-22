import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const handleChange = (event) => {
    // Handle input changes (future implementation)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic (future implementation)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Login card container */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
        {/* Page heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4 uppercase tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <div className="mb-6 relative">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password input field */}
          <div className="mb-6 relative">
            <FaLock className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-4 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <Link
            to="/forgotpassword"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign up link */}
        <div className="mt-2 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
