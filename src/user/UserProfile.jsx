import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      bgcolor="#f5f5f5"
    >
      {userData ? (
        <Card
          sx={{
            width: 350,
            padding: 2,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            >
              User Profile
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Full Name:</strong> {userData.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Gender:</strong> {userData.gender}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Department:</strong> {userData.department}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Role:</strong> {userData.role}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          No User Data Found
        </Typography>
      )}
    </Box>
  );
}
