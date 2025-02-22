import React, { useState } from "react";
import { useResetPasswordMutation } from "../apiSlice/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const ResetPasswordPage = () => {
  const [resetPassword] = useResetPasswordMutation();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const { token } = useParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      navigate("/"); // Redirect to login page after successful reset
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrorMessage(error.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-extrabold text-center text-gray-800 mb-4 uppercase tracking-wide">
          Reset Your Password
        </h2>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <FaLock className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={password}
              onChange={handlePasswordChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6 relative">
            <FaLock className="absolute left-4 top-4 text-gray-500 text-lg" />
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="pl-12 p-4 w-full border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 shadow-sm"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 text-white font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
