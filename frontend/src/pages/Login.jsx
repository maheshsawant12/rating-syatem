import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const rawRole = res.data.role;
      const role = rawRole.toLowerCase();

      localStorage.setItem("role", role);
      localStorage.setItem("user_id", res.data.id);


      if (role === "admin") {
        navigate("/admin");
      } else if (role === "normal") {
        navigate("/user");
      } else if (role === "storeowner") {
        navigate("/owner");
      } else alert("Unknown role");
    } catch (err) {
      alert("Login failed");
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <form
  onSubmit={handleLogin}
  className="max-w-sm mx-auto mt-20 bg-white shadow-lg rounded-xl p-6 space-y-4"
>
  <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      type="email"
      name="email"
      id="email"
      onChange={(e) => setEmail(e.target.value)}
      required
      className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="you@example.com"
    />
  </div>

  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
      Password
    </label>
    <input
      type="password"
      name="password"
      id="password"
      onChange={(e) => setPassword(e.target.value)}
      required
      className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="••••••••"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
  >
    Login
  </button>

  <p className="text-sm text-center text-gray-600">
    Don't have an account?{" "}
    <a
      href="/signup"
      className="text-blue-600 hover:underline font-medium"
    >
      Sign up
    </a>
  </p>
</form>

  );
}

export default Login;
