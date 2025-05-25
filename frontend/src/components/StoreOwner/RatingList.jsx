import { useEffect, useState } from 'react';
import axios from 'axios';

function RatingList() {
  const [ratings, setRatings] = useState([]);

  const fetchRatings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8000/api/v1/owner/dashboard', {
        withCredentials: true,
      });
      setRatings(res.data.all_rating);
    } catch (err) {
      alert('Failed to fetch ratings');
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">User Ratings</h3>
  
  <div className="overflow-x-auto">
    <table className="w-full text-sm border border-gray-200 rounded">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Rating</th>
        </tr>
      </thead>
      <tbody>
        {ratings.length === 0 ? (
          <tr>
            <td colSpan="3" className="py-4 text-center text-gray-500">
              No ratings yet.
            </td>
          </tr>
        ) : (
          ratings.map((user) => (
            <tr key={user.userId} className="hover:bg-gray-50 border-t">
              <td className="py-2 px-4">{user.user_name}</td>
              <td className="py-2 px-4">{user.user_email}</td>
              <td className="py-2 px-4 text-yellow-500 font-medium">{user.rating} ⭐</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default RatingList;
