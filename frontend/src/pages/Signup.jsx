import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'Normal'
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
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      errs.password = 'Password must be 8–16 chars, 1 uppercase, 1 special character.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await axios.post('http://localhost:8000/api/v1/auth/register', form, {
        withCredentials: true
      });
      alert('Signup successful. Please login.');
      navigate('/');
    } catch (error) {
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block">Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block">Address</label>
          <textarea
            placeholder="Your full address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Signup;
