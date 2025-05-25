import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
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
      await axios.post('http://localhost:5000/api/auth/signup', form);
      alert('Signup successful. Please login.');
      navigate('/');
    } catch (error) {
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">User Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <textarea
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button type="submit" className="bg-blue-500 text-white py-2 mt-2">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
