import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { useForgotPasswordMutation } from "../apiSlice/apiSlice";

const ForgotPasswordPage = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  // Handle input change for email field
  const handleChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  // Handle form submission to send password reset link
  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email).unwrap();
    alert("Reset link sent to email");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Card container */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
        {/* Page heading */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-4 uppercase tracking-wide">
          Forgot Password
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

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-4 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to login link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Back to Login{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
