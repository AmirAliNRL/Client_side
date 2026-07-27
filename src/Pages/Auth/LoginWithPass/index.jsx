import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import notify from '../../../Utils/Notify';
import FetchData from '../../../Utils/FetchData';
import { login } from '../../../Store/AuthSlice';

export default function LoginWithPass({ phoneNumber, handlePage }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation for phone number presence (though it's readOnly here, good practice)
    if (!phoneNumber.trim()) {
      notify("error", "Phone number is missing.");
      setLoading(false);
      return;
    }

    // Basic validation for password
    if (!password.trim()) {
      notify("error", "Please enter your password.");
      setLoading(false);
      return;
    }

    const result = await FetchData("auth/login-password", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, password }),
    });

    if (!result.success) {
      notify("error", result.message);
      setLoading(false);
      return;
    }

    notify("success", result.message);
    dispatch(login(result.data));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login
        </h2>
        <p className="text-sm text-center text-gray-600">
          Enter your password for <span className="font-medium text-gray-900">{phoneNumber}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Number Input (Read-only) */}
          <input
            type="text"
            readOnly
            value={phoneNumber}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 bg-gray-100 text-gray-800 cursor-not-allowed"
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-10" // Added pr-10 for potential icon space
              required // Added required attribute
            />
            {/* You could add a password visibility toggle icon here */}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading || !password.trim()}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200
              ${loading || !password.trim() ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center">
          <span
            onClick={() => handlePage('forget-pass')}
            className="text-sm font-medium text-teal-600 hover:text-teal-500 cursor-pointer"
          >
            Forget Password?
          </span>
        </div>
      </div>
    </div>
  );
}
