// UserLogin Component (Updated)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Config from '../Config';
import { TextField, Button, Typography, Box } from '@mui/material';

export default function UserLogin({ onUserLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.url}/verifyuserlogin`, formData);
      if (response.data != null) {
        onUserLogin();
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/userhome');
      } else {
        setMessage('User Login Failed');
        setError('');
      }
    } catch (error) {
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
        <u>User Login</u>
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
            label="Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
            id="password"
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
      <Box mt={2} textAlign="center">
        <Link to="/forgotpassword" style={{ textDecoration: 'none', color: '#1976d2' }}>
          Forgot Password?
        </Link>
      </Box>
    </Box>
  );
}
