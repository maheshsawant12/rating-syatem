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
    <div>
      <input
        type="text"
        placeholder="Search by name or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1 mb-4 w-full"
      />
      <div className="grid gap-4">
        {filteredStores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

export default StoreList;
