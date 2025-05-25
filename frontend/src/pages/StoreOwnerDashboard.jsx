import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RatingList from "../components/StoreOwner/RatingList";

function StoreOwnerDashboard() {
  const [average, setAverage] = useState(null);
  const navigate = useNavigate();

  const fetchAverage = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/owner/dashboard",
        {
          withCredentials: true,
        }
      );
      setAverage(res.data.average_rating);
    } catch (err) {
      alert("Failed to load average rating");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  useEffect(() => {
    fetchAverage();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Store Owner Dashboard
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handleChangePassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
        <p className="text-gray-700 text-lg">
          <span className="font-semibold text-blue-700">Average Rating:</span>{" "}
          <span className="text-yellow-500 font-bold">
            {average !== null ? average : "Loading..."}
          </span>
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <RatingList />
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;
