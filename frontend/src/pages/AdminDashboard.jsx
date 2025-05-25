import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import StatsBox from '../components/Admin/StatsBox';
import UserTable from '../components/Admin/UserTable';
import StoreTable from '../components/Admin/StoreTable';
import AddUserForm from '../components/Admin/AddUserForm';
import AddStoreForm from '../components/Admin/AddStoreForm';

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0
  });

  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/admin/dashboard', {
        withCredentials: true
      });
      setStats(res.data);
    } catch (err) {
      alert('Error fetching stats');
      console.error(err.response?.data || err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/v1/auth/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('roxiller_user'); // Clean up local state
      navigate('/');
    } catch (err) {
      alert('Logout failed');
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Top header with logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsBox title="Total Users" count={stats.total_users} />
        <StatsBox title="Total Stores" count={stats.total_stores} />
        <StatsBox title="Total Ratings" count={stats.total_ratings} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <AddUserForm />
        <AddStoreForm />
      </div>

      <div className="mt-6">
        <UserTable />
      </div>

      <div className="mt-6">
        <StoreTable />
      </div>
    </div>
  );
}

export default AdminDashboard;
