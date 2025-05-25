import { useEffect, useState } from 'react';
import axios from 'axios';

function StoreTable() {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/admin/stores', {
        withCredentials: true // ✅ Send accessToken via cookie
      });
      setStores(res.data);
    } catch (err) {
      alert('Failed to fetch stores');
      console.error(err.response?.data || err.message);
    }
  };

  const sortedStores = [...stores]
    .filter(store =>
      (store.name || '').toLowerCase().includes(filter.toLowerCase()) ||
      (store.email || '').toLowerCase().includes(filter.toLowerCase()) ||
      (store.address || '').toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = (a[sortKey] || '').toString().toLowerCase();
      const bVal = (b[sortKey] || '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Stores</h2>
      <input
        type="text"
        placeholder="Search by name/email/address"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-2 p-1 border w-full"
      />
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 cursor-pointer">
          <tr>
            <th onClick={() => toggleSort('name')}>Name</th>
            <th onClick={() => toggleSort('email')}>Email</th>
            <th onClick={() => toggleSort('address')}>Address</th>
            <th onClick={() => toggleSort('average_rating')}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {sortedStores.length === 0 ? (
            <tr><td colSpan="4" className="text-center py-2">No stores found.</td></tr>
          ) : (
            sortedStores.map(store => (
              <tr key={store.id} className="text-center border-t">
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StoreTable;
