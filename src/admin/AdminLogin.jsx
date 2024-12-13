import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Config from '../Config';
import { TextField, Button, Typography, Box } from '@mui/material';

export default function AdminLogin({ onAdminLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.url}/verifyadminlogin`, formData);
      if (response.data != null) {
        onAdminLogin();
        localStorage.setItem('admin', JSON.stringify(response.data));
        navigate('/adminhome');
      } else {
        setMessage('Login Failed');
        setError('');
      }
    } catch (error) {
      // Display a generic error message for login failure
      if (error.response && error.response.status === 401) {
        setMessage('Login Failed');
      } else {
        setMessage('An error occurred');
      }
      setError('');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        <u>Admin Login</u>
      </Typography>
      {message && (
        <Typography variant="h6" align="center" color="primary" gutterBottom>
          {message}
        </Typography>
      )}
      {error && (
        <Typography variant="h6" align="center" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ padding: '10px' }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}
