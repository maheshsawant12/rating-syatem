import axios from 'axios';
import { useState } from 'react';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      'http://localhost:8000/api/v1/auth/update-password',
      { password: newPassword },
      { withCredentials: true }
    );

    alert(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data);
    } else {
      alert('An error occurred while changing the password.');
    }
  }
};


  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
