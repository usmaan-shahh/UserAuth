import React from "react";

const ResetPassword = () => {
  const handleChange = (e) => {};

  const handleSubmit = async (e) => {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          <b>Reset Your Password</b>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="newPassword"
            >
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="confirmNewPassword"
            >
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errorMessage}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Reset Password
            </button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Remember your password?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
