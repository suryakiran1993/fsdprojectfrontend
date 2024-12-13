import { useState } from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here
    console.log(formData);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
