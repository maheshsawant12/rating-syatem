import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function StoreRatingPage() {
  const { id: storeId } = useParams();
  const [store, setStore] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/user");
    }
  };

  const fetchStoreData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/store/${storeId}/ratings`,
        { withCredentials: true }
      );

      const currentUserId = res.data.currentUserId;

      setStore(res.data.store);
      setAllRatings(res.data.rating || []);

      const userRating = res.data.rating.find(
        (r) => r.user_id === currentUserId
      );

      if (userRating) {
        setMyRating(userRating.rating);
      } else {
        setMyRating(0);
      }
    } catch (err) {
      console.error(
        "Failed to fetch store data:",
        err.response?.data || err.message
      );
    }
  };

  const submitRating = async (newRating) => {
    setMessage("Saving...");
    try {
      if (myRating > 0) {
        await axios.put(
          `http://localhost:8000/api/v1/user/stores/${storeId}/edit-rating`,
          { rating: newRating },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `http://localhost:8000/api/v1/user/store/${storeId}/ratings`,
          { rating: newRating },
          { withCredentials: true }
        );
      }

      setMyRating(newRating);
      setMessage("Rating saved!");
      fetchStoreData();
    } catch (err) {
      console.error("Rating error:", err.response?.data || err.message || err);
      setMessage(err.response?.data?.message || "Error saving rating.");
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  if (!store) return <div className="p-4">Loading store data...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div className="bg-white shadow rounded p-4 w-full">
          <h2 className="text-2xl font-bold text-blue-600">{store.name}</h2>
          <p className="text-sm text-gray-600">{store.address}</p>
          <p className="text-sm mt-1">
            Average Rating:{" "}
            <b className="text-yellow-500">{store.average_rating || "N/A"}</b>
          </p>
        </div>
        <button
          onClick={() => handleBack()}
          className="ml-4 text-sm text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Your Rating</h3>
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => submitRating(r)}
              className={`text-xl ${
                myRating >= r ? "text-yellow-400" : "text-gray-400"
              } hover:scale-110 transition-transform`}
              aria-label={`Rate ${r}`}
            >
              <FaStar />
            </button>
          ))}
        </div>
        {message && <p className="text-sm text-blue-600">{message}</p>}
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">All Ratings</h3>
        {allRatings.length === 0 ? (
          <p className="text-sm text-gray-500">No ratings yet.</p>
        ) : (
          <ul className="space-y-2">
            {allRatings.map((r) => (
              <li
                key={r.id || `${r.user_id}-${r.created_at}`}
                className="text-sm border-b pb-2"
              >
                <span className="font-medium">User:</span> {r.user_name} <br />
                <span className="font-medium">Rating:</span>{" "}
                <span className="text-yellow-500">{r.rating} ⭐</span> <br />
                <span className="font-medium">Date:</span>{" "}
                {new Date(r.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StoreRatingPage;
