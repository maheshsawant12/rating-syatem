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
    <div>
      <h2 className="text-lg font-semibold mb-2">Users</h2>
      <input
        type="text"
        placeholder="Search by name/email/address/role"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-2 p-1 border w-full"
      />
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 cursor-pointer">
          <tr>
            <th onClick={() => toggleSort('id')}>Id</th>
            <th onClick={() => toggleSort('name')}>Name</th>
            <th onClick={() => toggleSort('email')}>Email</th>
            <th onClick={() => toggleSort('address')}>Address</th>
            <th onClick={() => toggleSort('role')}>Role</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length === 0 ? (
            <tr><td colSpan="6" className="text-center py-2">No users found.</td></tr>
          ) : (
            sortedUsers.map((user, index) => (
              <tr key={index} className="text-center border-t">
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.role === 'StoreOwner' ? (user.rating ?? 'null') : 'null'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
