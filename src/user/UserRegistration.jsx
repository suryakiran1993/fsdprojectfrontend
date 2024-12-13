import { useState } from 'react';
import axios from 'axios';
import Config from '../Config';

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    department: '',
    email: '',
    password: '',
    role: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.url}/adduser`, formData);
      if (response.status === 200) {
        setFormData({
          name: '',
          gender: '',
          department: '',
          email: '',
          password: '',
          role: '',
        });
      }

     setMessage('User Registered Successfully');
      setError('');
    } catch (error) {
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h3 style={{textAlign: 'center'}}><u>User Registration</u></h3>
      {message ? (
        <h4 style={{textAlign: 'center',color:'green'}}>{message}</h4>
      ) : (
        <h4 style={{ color: 'red', textAlign: 'center' }}>{error}</h4>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Department</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="ADMINISTRATOR">ADMINISTRATOR</option>
            <option value="HOD">HOD</option>
            <option value="PRINCIPAL">PRINCIPAL</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
