import { useState } from 'react';
import axios from 'axios';

function AddStoreForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) {
      errs.name = 'Store name must be 20 to 60 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errs.email = 'Invalid email format.';
    }
    if (form.address.length > 400) {
      errs.address = 'Address can be max 400 characters.';
    }
    if (!form.owner_id || isNaN(form.owner_id)) {
      errs.owner_id = 'Owner ID must be a valid number.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        owner_id: form.owner_id
      };

      await axios.post('http://localhost:8000/api/v1/admin/add-store', payload, {
        withCredentials: true
      });

      alert('Store added successfully!');
      setForm({ name: '', email: '', address: '', owner_id: '' });
    } catch (err) {
      alert('Failed to add store.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
   <div className="bg-white p-6 rounded-xl shadow-md">
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <div>
      <input
        type="text"
        placeholder="Store Name"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}
    </div>

    <div>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}
    </div>

    <div>
      <textarea
        placeholder="Address"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        rows="3"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
      )}
    </div>

    <div>
      <input
        type="number"
        placeholder="Owner ID"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={form.owner_id}
        onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
      />
      {errors.owner_id && (
        <p className="text-red-500 text-sm mt-1">{errors.owner_id}</p>
      )}
    </div>

    <button
      type="submit"
      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow transition"
    >
      Add Store
    </button>
  </form>
</div>

  );
}

export default AddStoreForm;