import { useNavigate } from 'react-router-dom';
import StoreList from '../components/User/StoreList';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800">Welcome, User</h2>
    
    <div className="mt-4 md:mt-0 space-x-2">
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

  <div className="bg-white shadow rounded-lg p-4">
    <StoreList />
  </div>
</div>

  );
}

export default UserDashboard;
