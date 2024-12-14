import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../Config';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { green, red, yellow, blue } from '@mui/material/colors';

export default function AdminHome() {
  const [adminData, setAdminData] = useState("");
  const [taskCounts, setTaskCounts] = useState({
    totalTasks: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const storedAdminData = localStorage.getItem('admin');
    if (storedAdminData) {
      const parsedAdminData = JSON.parse(storedAdminData);
      setAdminData(parsedAdminData);
      fetchTaskCounts();
    }
  }, []);

  const fetchTaskCounts = async () => {
    try {
      const response = await axios.get(`${Config.url}/getalltasks`);
      const allTasks = response.data;

      // Categorizing tasks by their statuses
      const categorizedCounts = {
        totalTasks: allTasks.length,
        assigned: allTasks.filter(task => task.status === 'ASSIGNED').length,
        inProgress: allTasks.filter(task => task.status === 'IN PROGRESS').length,
        completed: allTasks.filter(task => task.status === 'COMPLETED').length,
      };

      setTaskCounts(categorizedCounts);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);  // Set loading to false once data is fetched
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, marginLeft: '240px' }}>
      {adminData ? (
        <div>
          <Typography variant="h4" gutterBottom color="primary">
            Welcome {adminData.username}
          </Typography>

          {/* Displaying task analysis */}
          <Grid container spacing={4}>
            {/* Total Tasks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: blue[50], boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {loading ? <CircularProgress color="primary" size={24} /> : taskCounts.totalTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Assigned Tasks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: yellow[100], boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Assigned Tasks
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    {loading ? <CircularProgress color="secondary" size={24} /> : taskCounts.assigned}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* In Progress Tasks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: yellow[200], boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    In Progress Tasks
                  </Typography>
                  <Typography variant="h5" color="warning">
                    {loading ? <CircularProgress color="warning" size={24} /> : taskCounts.inProgress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Completed Tasks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: green[100], boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Completed Tasks
                  </Typography>
                  <Typography variant="h5" color="success">
                    {loading ? <CircularProgress color="success" size={24} /> : taskCounts.completed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Error handling */}
          {error && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="error">
                Error: {error}
              </Typography>
            </Box>
          )}
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
