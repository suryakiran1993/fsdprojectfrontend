import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Button, Card, CardContent, Grid, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import Config from '../Config';

const MyTaskProgressUpdates = () => {
  const { state } = useLocation();
  const { task } = state;

  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (!userData || !task.id) return; // Ensure userData and task.id are available

    const fetchProgressUpdates = async () => {
      try {
        const response = await axios.get(`${Config.url}/myreviewtaskprogress/${task.id}`);
        setProgressUpdates(response.data);
      } catch (err) {
        setError('Failed to fetch task progress updates.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, [userData, task.id]);  // Add task.id and userData to the dependency array

  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`${Config.url}/downloadprogressfile/${id}`, {
        responseType: 'blob', // To handle binary data
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Task_${id}_Progress.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert(`No file found for Task ID: ${id}`);
      }
    } catch (err) {
      console.error(`Failed to download file for task ID: ${id}`, err);
      alert('Failed to download file. Please try again.');
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', marginTop: 2 }}>{error}</Typography>;
  }

  return (
    <Paper
      sx={{
        marginTop: 4,
        marginLeft: { xs: 0, sm: '240px' }, // Add margin for the nav bar
        padding: 2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        width: { xs: '100%', sm: 'calc(100% - 240px)' }, // Adjust width dynamically
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textAlign: 'center',
          padding: 2,
          color: '#3f51b5',
          fontWeight: 'bold',
        }}
      >
        My Task Progress Updates
      </Typography>
      <Grid container spacing={3}>
        {progressUpdates.map((update) => (
          <Grid item xs={12} sm={6} md={4} key={update.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Task ID: {update.taskid}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Progress:</strong> {update.progress}%
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Remarks:</strong> {update.remarks || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Updated Time:</strong> {new Date(update.progressUpdatedTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Status:</strong> {update.reviewstatus}
                </Typography>

                {update.hasFile ? (
                  <IconButton
                    color="primary"
                    onClick={() => downloadFile(update.id)}
                    sx={{ marginTop: 2 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                    No File
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default MyTaskProgressUpdates;
