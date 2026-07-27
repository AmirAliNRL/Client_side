import React, { useState, useEffect } from "react";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";

export default function ForgetPass({ handlePage }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0); // 2 minutes = 120 seconds

  // Effect for the resend code timer
  useEffect(() => {
    let countdown;
    if (resendDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!phoneNumber.trim()) {
      notify("error", "Please enter your phone number.");
      setLoading(false);
      return;
    }
    if (!code.trim()) {
      notify("error", "Please enter the verification code.");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      notify("error", "Please enter a new password.");
      setLoading(false);
      return;
    }

    const result = await FetchData("auth/forget-password", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, code, newPassword: password }),
    });

    if (!result.success) {
      notify("error", result.message);
      setLoading(false);
      return;
    }

    notify("success", result.message);
    handlePage("firstStep"); // Navigate back to the first step (e.g., login page)
    setLoading(false);
  };

  const handleResendCode = async () => {
    if (!phoneNumber.trim()) {
      notify("error", "Please enter your phone number first.");
      return;
    }
    const result = await FetchData("auth/resend-code", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    notify(result.success ? "success" : "error", result.message);
    setCode(""); // Clear the code input
    setResendDisabled(true); // Disable resend button
    setTimer(120); // Reset timer to 2 minutes
  };

  // Helper to format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <span
            onClick={() => handlePage("firstStep")}
            className="text-sm text-teal-600 hover:text-teal-500 cursor-pointer font-medium flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0 7-7m-7 7h13a2 2 0 002-2v-4a2 2 0 00-2-2H3m10 4a2 2 0 012 2v4a2 2 0 01-2 2H3m10-4a2 2 0 00-2-2H3m10 4a2 2 0 002 2h10"
              ></path>
            </svg>
            Go Back
          </span>
          <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Number Input */}
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            required
          />

          {/* Code Input and Resend Button */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Verification Code"
              className="flex-grow border border-gray-300 rounded-lg py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <button
              type="button" // Changed to type="button" to prevent form submission
              onClick={handleResendCode}
              disabled={resendDisabled || !phoneNumber.trim()} // Also disable if phone number is not entered
              className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 text-sm
                ${resendDisabled || !phoneNumber.trim()
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-teal-100 text-teal-600 hover:bg-teal-200"
                }`}
            >
              {resendDisabled ? `Wait (${formatTime(timer)})` : "Resend"}
            </button>
          </div>

          {/* New Password Input */}
          <input
            type="password" // Changed to password type for security
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !code.trim() || !password.trim()}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200
              ${loading || !code.trim() || !password.trim() ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
