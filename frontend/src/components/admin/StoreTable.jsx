import { useEffect, useState } from "react";
import axios from "axios";

function StoreTable() {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/admin/stores", {
        withCredentials: true,
      });
      setStores(res.data);
    } catch (err) {
      alert("Failed to fetch stores");
      console.error(err.response?.data || err.message);
    }
  };

  const sortedStores = [...stores]
    .filter(
      (store) =>
        (store.name || "").toLowerCase().includes(filter.toLowerCase()) ||
        (store.email || "").toLowerCase().includes(filter.toLowerCase()) ||
        (store.address || "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = (a[sortKey] || "").toString().toLowerCase();
      const bVal = (b[sortKey] || "").toString().toLowerCase();
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <input
        type="text"
        placeholder="Search by name, email, or address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-center">
              <th
                onClick={() => toggleSort("name")}
                className="px-4 py-2 cursor-pointer hover:underline"
              >
                Name
              </th>
              <th
                onClick={() => toggleSort("email")}
                className="px-4 py-2 cursor-pointer hover:underline"
              >
                Email
              </th>
              <th
                onClick={() => toggleSort("address")}
                className="px-4 py-2 cursor-pointer hover:underline"
              >
                Address
              </th>
              <th
                onClick={() => toggleSort("average_rating")}
                className="px-4 py-2 cursor-pointer hover:underline"
              >
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStores.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No stores found.
                </td>
              </tr>
            ) : (
              sortedStores.map((store) => (
                <tr
                  key={store.id}
                  className="border-t text-center hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{store.name}</td>
                  <td className="px-4 py-2">{store.email}</td>
                  <td className="px-4 py-2">{store.address}</td>
                  <td className="px-4 py-2">
                    {store.average_rating
                      ? parseFloat(store.average_rating).toFixed(1)
                      : "N/A"}
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

export default StoreTable;
