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
      navigateTo("/verifyemail", {
        state: { email: formData.email },
      });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="text"
              name="name"
              placeholder="Username"
              onChange={handleChange}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4 relative">
            <FaLock className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">
              {error.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
