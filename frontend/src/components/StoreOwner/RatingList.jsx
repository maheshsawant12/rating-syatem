import { useEffect, useState } from 'react';
import axios from 'axios';

function RatingList() {
  const [ratings, setRatings] = useState([]);

  const fetchRatings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/store-owner/ratings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(res.data);
    } catch (err) {
      alert('Failed to fetch ratings');
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">User Ratings</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length === 0 ? (
            <tr><td colSpan="3" className="text-center py-2">No ratings yet.</td></tr>
          ) : (
            ratings.map(user => (
              <tr key={user.userId} className="text-center">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.rating}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RatingList;
