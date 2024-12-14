import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import Config from '../Config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.url}/forgotpassword/${email}`);
  
      // Adjust this condition based on the actual backend response
      if (response.data.success || response.status === 200) {
        setMessage(response.data.message || 'Password reset instructions sent to your email.');
        setError('');
      } else {
        setError(response.data.message || 'Failed to send reset instructions. Please try again.');
        setMessage('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
      setMessage('');
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
        <u>Forgot Password</u>
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
            label="Enter Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Submit
        </Button>
      </form>
    </Box>
  );
}
