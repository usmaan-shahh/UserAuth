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
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaLock className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4 relative">
            <FaLock className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
