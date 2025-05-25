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
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
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
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen space-y-8">
  <div className="flex justify-between items-center border-b pb-4">
    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
    >
      Logout
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatsBox title="Total Users" count={stats.total_users} />
    <StatsBox title="Total Stores" count={stats.total_stores} />
    <StatsBox title="Total Ratings" count={stats.total_ratings} />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New User</h2>
      <AddUserForm />
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Store</h2>
      <AddStoreForm />
    </div>
  </div>

  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Users</h2>
    <UserTable />
  </div>

  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Stores</h2>
    <StoreTable />
  </div>
</div>

  );
}

export default AdminDashboard;
