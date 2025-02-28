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
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4 relative">
            <FaLock className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgotpassword"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
