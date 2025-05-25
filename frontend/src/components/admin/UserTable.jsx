import { useEffect, useState } from 'react';
import axios from 'axios';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/admin/users', {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      alert('Failed to fetch users');
      console.error(err.response?.data || err.message);
    }
  };

  const sortedUsers = [...users]
    .filter(user =>
      (user.name || '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.address || '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = (a[sortKey] || '').toString().toLowerCase();
      const bVal = (b[sortKey] || '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

  <input
    type="text"
    placeholder="Search by name, email, address, or role"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="mb-4 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-left border border-gray-200">
      <thead className="bg-gray-100 text-gray-700">
        <tr className='text-center'>
          <th
            onClick={() => toggleSort('id')}
            className="px-4 py-2 cursor-pointer hover:underline"
          >
            ID
          </th>
          <th
            onClick={() => toggleSort('name')}
            className="px-4 py-2 cursor-pointer hover:underline"
          >
            Name
          </th>
          <th
            onClick={() => toggleSort('email')}
            className="px-4 py-2 cursor-pointer hover:underline"
          >
            Email
          </th>
          <th
            onClick={() => toggleSort('address')}
            className="px-4 py-2 cursor-pointer hover:underline"
          >
            Address
          </th>
          <th
            onClick={() => toggleSort('role')}
            className="px-4 py-2 cursor-pointer hover:underline"
          >
            Role
          </th>
          <th className="px-4 py-2">Rating</th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center py-4 text-gray-500">
              No users found.
            </td>
          </tr>
        ) : (
          sortedUsers.map((user, index) => (
            <tr key={index} className="border-t text-center hover:bg-gray-50">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.address}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">
                {user.role === 'StoreOwner' ? user.rating ?? 'null' : 'null'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default UserTable;
