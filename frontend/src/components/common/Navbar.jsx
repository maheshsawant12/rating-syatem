import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo / Brand */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Roxiller<span className="text-gray-800">Rate</span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 font-medium">Users</Link>
            <Link to="/admin/stores" className="text-gray-700 hover:text-blue-600 font-medium">Stores</Link>
          </>
        )}

        {user?.role === 'user' && (
          <>
            <Link to="/user/stores" className="text-gray-700 hover:text-blue-600 font-medium">Stores</Link>
            <Link to="/user/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
          </>
        )}

        {user?.role === 'owner' && (
          <>
            <Link to="/owner" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/owner/ratings" className="text-gray-700 hover:text-blue-600 font-medium">Ratings</Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
