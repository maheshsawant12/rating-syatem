import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RatingList from '../components/StoreOwner/RatingList';

function StoreOwnerDashboard() {
  const [average, setAverage] = useState(null);
  const navigate = useNavigate();

  const fetchAverage = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/store-owner/average-rating', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAverage(res.data.averageRating);
    } catch (err) {
      alert('Failed to load average rating');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    fetchAverage();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Store Owner Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>

      <div className="bg-blue-100 p-3 rounded">
        <p><b>Average Rating:</b> {average !== null ? average.toFixed(2) : 'Loading...'}</p>
      </div>

      <RatingList />
    </div>
  );
}

export default StoreOwnerDashboard;
