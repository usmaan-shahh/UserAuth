import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../apiSlice/apiSlice";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const SignupPage = () => {
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigateTo("/verifyemail");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6 uppercase tracking-wide">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <FaUser className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="text"
              name="name"
              placeholder="Username"
              onChange={handleChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <div className="mb-6 relative">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <div className="mb-6 relative">
            <FaLock className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            {isLoading ? "Signing Up..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer font-semibold">
            <Link to="/">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
