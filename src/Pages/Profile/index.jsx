import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchData from "../../Utils/FetchData";
import notify from "../../Utils/Notify";
import { updateUser } from "../../Store/AuthSlice";

export default function Profile() {
  const { user, token } = useSelector((state) => state.auth);
  
  const [fullName, setFullName] = useState(user.fullName || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await FetchData(`users/${user._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName }),
    });

    setLoading(false);
    if (result.success) {
      notify("success", result.message);
      dispatch(updateUser(result.data));
    } else {
      notify("error", result.message);
    }
  };

  const handlePass = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await FetchData(`users/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    setLoading(false);
    if (result.success) {
      notify("success", result.message);
      setOldPassword(""); // Clear the password fields on success
      setNewPassword("");
    } else {
      notify("error", result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Profile</h2>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg p-2 transition duration-150 focus:ring focus:ring-teal-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>

        {/* Change Password Form */}
        <h2 className="text-2xl font-bold text-center text-gray-800 my-6">Change Password</h2>
        <form onSubmit={handlePass} className="space-y-4">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter Old Password"
            className="block w-full border border-gray-300 rounded-lg p-2 transition duration-150 focus:ring focus:ring-teal-400"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter New Password"
            className="block w-full border border-gray-300 rounded-lg p-2 transition duration-150 focus:ring focus:ring-teal-400"
            required
          />
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
