import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  Avatar 
} from '@mui/material';
import Config from '../Config';

export default function UpdateUserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    email: '',
    password: '',
    department: '',
    role: '',
    userimage: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setUserData({ ...userData, gender: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    setSelectedImage(null);
    setIsEditing(false);
  };

  // Update profile function (excluding image update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${Config.url}/updateuser`, userData);
      setMessage(response.data);
      setError('');
      localStorage.setItem('user', JSON.stringify(userData));
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data || 'An error occurred while updating profile');
      setMessage('');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file); // Append the image file to form data

      try {
        const response = await axios.put(
          `${Config.url}/updateuserimage/${userData.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Ensure this header is set
            },
          }
        );
        setMessage(response.data);
        setError('');
        setSelectedImage(URL.createObjectURL(file)); // Preview the uploaded image
      } catch (err) {
        setError(err.response?.data || 'An error occurred while updating the image');
        setMessage('');
      }
    }
  };
  
  return (
    <Box
      sx={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        User Profile
      </Typography>
      {message && (
        <Typography
          variant="h6"
          align="center"
          color="primary"
          gutterBottom
        >
          {message}
        </Typography>
      )}
      {error && (
        <Typography
          variant="h6"
          align="center"
          color="error"
          gutterBottom
        >
          {error}
        </Typography>
      )}

      {/* Image Upload Section */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          src={selectedImage || userData.userimage || ''}
          alt="User Image"
          sx={{
            width: 100,
            height: 100,
            margin: '0 auto',
            backgroundColor: '#ccc',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('imageUpload').click()}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="imageUpload"
          onChange={handleImageChange}
        />
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Full Name"
            id="name"
            value={userData.name}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{ readOnly: !isEditing }}
          />
        </Box>

        <Box mb={2}>
          <FormControl component="fieldset" disabled={!isEditing}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={userData.gender}
              onChange={handleGenderChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Department"
            id="department"
            value={userData.department}
            variant="outlined"
            InputProps={{ readOnly: true }}
            helperText="📍 Read-Only"
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            id="email"
            value={userData.email}
            variant="outlined"
            InputProps={{ readOnly: true }}
            helperText="⚙️ Read-Only"
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
            id="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{ readOnly: !isEditing }}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Contact"
            id="contact"
            type="number"
            value={userData.contact}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{ readOnly: !isEditing }}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Role"
            id="role"
            value={userData.role}
            variant="outlined"
            InputProps={{ readOnly: true }}
            helperText="⚙️ Read-Only"
          />
        </Box>

        {/* Buttons */}
        {!isEditing ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleEdit}
            sx={{ padding: '10px' }}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ padding: '10px', marginRight: '10px' }}
            >
              Save
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ padding: '10px' }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
}
