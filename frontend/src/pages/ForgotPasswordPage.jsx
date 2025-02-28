import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { useForgotPasswordMutation } from "../apiSlice/apiSlice";

const ForgotPasswordPage = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setMessage("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center text-sm text-gray-600 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Back to{" "}
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
