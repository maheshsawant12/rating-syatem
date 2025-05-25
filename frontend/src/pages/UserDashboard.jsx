import { useNavigate } from 'react-router-dom';
import StoreList from '../components/User/StoreList';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Welcome, User</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
      <StoreList />
    </div>
  );
}

export default UserDashboard;
