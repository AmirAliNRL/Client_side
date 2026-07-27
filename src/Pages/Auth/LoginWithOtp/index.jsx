import React, { useState, useEffect } from "react";
import notify from "../../../Utils/Notify";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/AuthSlice";
import FetchData from "../../../Utils/FetchData";

export default function LoginWithOtp({ phoneNumber, handlePage }) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120); // 2 minutes = 120 seconds
  const dispatch = useDispatch();

  // 🔁 Timer Effect: counts down when resendDisabled is true
  useEffect(() => {
    let countdown;
    if (resendDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
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

    const result = await FetchData("auth/login-otp", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ phoneNumber, code }),
    });

    if (!result.success) {
      notify("error", result.message);
      setCode("");
      setLoading(false);
      return;
    }

    notify("success", result.message);
    dispatch(login(result.data));
    setLoading(false);
  };

  const resendCode = async () => {
    const result = await FetchData("auth/resend-code", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    notify(result.success ? "success" : "error", result.message);
    setCode("");
    setResendDisabled(true);
    setTimer(120); // reset countdown to 2 minutes
  };

  // 🧮 helper: format timer as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h2>
        <p className="text-sm text-center text-gray-600">
          We sent a code to <span className="font-medium text-gray-900">{phoneNumber}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Readonly phone field */}
          <input
            type="text"
            readOnly
            value={phoneNumber}
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 bg-gray-100 text-gray-800 cursor-not-allowed"
          />

          {/* OTP input */}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Your Code"
            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !code}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200
              ${loading || !code ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {/* Resend section */}
          <div className="text-center space-y-1">
            <button
              type="button"
              disabled={resendDisabled}
              onClick={resendCode}
              className={`text-sm font-medium transition-all duration-200 rounded-md px-4 py-1.5
                ${resendDisabled
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-teal-600 hover:text-teal-700 bg-teal-50"}
              `}
            >
              Resend Code
            </button>
            {resendDisabled &&
              <p className="text-xs text-gray-500">Resend available in {formatTime(timer)}</p>}
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Wrong number?
          <span
            onClick={() => handlePage("first-step")}
            className="ml-1 text-teal-600 hover:text-teal-500 cursor-pointer font-medium"
          >
            Edit phone number
          </span>
        </p>
      </div>
    </div>
  );
}
