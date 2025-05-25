import { useState } from 'react';
import axios from 'axios';

function AddUserForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'Normal', 
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) {
      errs.name = 'Name must be 20 to 60 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errs.email = 'Invalid email.';
    }
    if (form.address.length > 400) {
      errs.address = 'Address can be max 400 characters.';
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(form.password)) {
      errs.password = 'Password must be 8–16 characters, include 1 uppercase & 1 special character.';
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
        password: form.password,
        address: form.address,
        role: form.role 
      };

      await axios.post('http://localhost:8000/api/v1/admin/add-user', payload, {
        withCredentials: true
      });

      alert('User added!');
      setForm({ name: '', email: '', address: '', password: '', role: 'Normal' });
    } catch (err) {
      alert('Failed to add user.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <div>
      <input
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Name"
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
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}
    </div>

    <div>
      <textarea
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        rows="3"
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
      )}
    </div>

    <div>
      <input
        type="password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
      )}
    </div>

    <div>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="Normal">Normal User</option>
        <option value="Admin">Admin</option>
        <option value="StoreOwner">Store Owner</option>
      </select>
    </div>

    <button
      type="submit"
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow transition"
    >
      Add User
    </button>
  </form>
</div>

  );
}

export default AddUserForm;
