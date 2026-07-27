import React from "react";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";

export default function FirstStep({
  handlePage,
  phoneNumber,
  handlePhoneNumber,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: ensure phone number is not empty
    if (!phoneNumber.trim()) {
      notify("error", "Please enter your phone number.");
      return;
    }

    const result = await FetchData("auth", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!result.success) {
      notify("error", result.message);
      return;
    }

    notify("success", result.message);
    // Adjusting handlePage call based on potential backend responses
    handlePage(result.data.passwordExist ? "password" : "otp");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your phone number to continue.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel" // Use 'tel' for phone numbers for better mobile experience
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => handlePhoneNumber(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Login Or Register
            </button>
          </div>

          <div className="text-sm text-center">
            <span
              onClick={() => handlePage("forget-pass")}
              className="font-medium text-teal-600 hover:text-teal-500 cursor-pointer"
            >
              Forget Password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
