import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const handleChange = (e) => {};

  const handleSubmit = (e) => {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          <b>Forgot Password</b>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Enter your email address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Remember your password?{" "}
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
