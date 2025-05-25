import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging User...");

      const res = await axios.post(
        'http://localhost:8000/api/v1/auth/login',
        { email, password },
        { withCredentials: true }
      );

      console.log("API Hit ✅");

      // You might get role as part of response data
      const role = res.data.role;
      console.log(res.data);
      localStorage.setItem('role', role); // only storing role

      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'user') navigate('/user');
      else if (role === 'store_owner') navigate('/store-owner');
    } catch (err) {
      alert('Login failed');
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" name="password" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
