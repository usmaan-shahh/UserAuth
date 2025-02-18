import React, { useState } from "react";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the 6-digit code sent to your email.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="code"
            >
              Verification Code:
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={handleChange}
              required
              maxLength="6"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md text-center tracking-widest"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
