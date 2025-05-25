import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function StoreRatingPage() {
  const { id: storeId } = useParams();
  const [store, setStore] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [message, setMessage] = useState("");

  const fetchStoreData = async () => {
    try {
      // Reset rating before fetching new data
      setMyRating(0);
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/store/${storeId}/ratings`,
        {
          withCredentials: true,
        }
      );

      setStore(res.data.store);
      setAllRatings(res.data.rating || []);

      const currentUserId = JSON.parse(
        localStorage.getItem("roxiller_user")
      )?.id;

      const userRating = res.data.rating.find(
        (r) => r.user_id === currentUserId
      );

      if (userRating) {
        setMyRating(userRating.rating);
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
    let res;
    if (myRating > 0) {
      // Already rated → use PUT to update
      res = await axios.post(
        `http://localhost:8000/api/v1/user/stores/${storeId}/edit-rating`,
        { rating: newRating },
        { withCredentials: true }
      );
    } else {
      // First time rating → use POST
      res = await axios.post(
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
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-2xl font-bold text-blue-600">{store.name}</h2>
        <p className="text-sm text-gray-600">{store.address}</p>
        <p className="text-sm mt-1">
          Average Rating: <b>{store.average_rating || "N/A"}</b>
        </p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Your Rating</h3>
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => submitRating(r)}
              className={`px-3 py-1 rounded border ${
                myRating === r ? "bg-yellow-400" : "bg-gray-200"
              }`}
            >
              {r}
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
              <li key={r.id} className="text-sm border-b pb-2">
                <span className="font-medium">User:</span> {r.user_name} <br />
                <span className="font-medium">Rating:</span> {r.rating} <br />
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
