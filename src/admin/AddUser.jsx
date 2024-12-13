import { useState } from 'react';
import axios from 'axios';
import Config from '../Config';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Box } from '@mui/material';

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    department: '',
    email: '',
    password: '',
    role: '',
    contact: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target; // Use 'name' instead of 'id'
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.url}/adduser`, formData);
      // Check for successful response status (201 Created)
      if (response.status === 201 || response.status === 200) {
        setFormData({
          name: '',
          gender: '',
          department: '',
          email: '',
          password: '',
          role: '',
          contact: '',
        });
        setMessage('User Added Successfully');
        setError('');
      }
    } catch (error) {
      // Check if the error response contains a specific message
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || 'Email or Contact already exists.');
      } else {
        setError('An unexpected error occurred.');
      }
      setMessage('');
    }
  };
  
  
  return (
    <Box sx={{ padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        <u>Add User</u>
      </Typography>
      {message ? (
        <Typography variant="h6" align="center" color="green">{message}</Typography>
      ) : (
        <Typography variant="h6" align="center" color="error">{error}</Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ marginBottom: '15px' }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ marginBottom: '15px' }}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{ marginBottom: '15px' }}
        />
        <TextField
          fullWidth
          label="Contact Number"
          name="contact"
          type="tel"
          value={formData.contact}
          onChange={handleChange}
          required
          sx={{ marginBottom: '15px' }}
        />
        <FormControl fullWidth required sx={{ marginBottom: '15px' }}>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender" // Use 'name' for Select components
            value={formData.gender}
            onChange={handleChange}
            label="Gender"
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth required sx={{ marginBottom: '15px' }}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department" // Use 'name' for Select components
            value={formData.department}
            onChange={handleChange}
            label="Department"
          >
            <MenuItem value="">Select Department</MenuItem>
            <MenuItem value="CSE">CSE</MenuItem>
            <MenuItem value="ECE">ECE</MenuItem>
            <MenuItem value="EEE">EEE</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth required sx={{ marginBottom: '15px' }}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role" // Use 'name' for Select components
            value={formData.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="PRINCIPAL">PRINCIPAL</MenuItem>
            <MenuItem value="HOD">HOD</MenuItem>
            <MenuItem value="FACULTY">FACULTY</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ padding: '10px', marginTop: '20px' }}
        >
          Add
        </Button>
      </form>
    </Box>
  );
}
