import { useEffect, useState } from 'react';
import axios from 'axios';
import StoreCard from './StoreCard';

function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/stores', {
        withCredentials: true,
      });
      setStores(res.data);
    } catch (err) {
      alert('Error loading stores');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-6">
  <input
    type="text"
    placeholder="Search by name or address"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
  />

  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {filteredStores.length > 0 ? (
      filteredStores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))
    ) : (
      <p className="text-gray-500 text-sm">No stores match your search.</p>
    )}
  </div>
</div>

  );
}

export default StoreList;
