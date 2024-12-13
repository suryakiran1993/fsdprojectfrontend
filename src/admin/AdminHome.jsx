import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../Config';
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';

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
    <Container maxWidth="lg" sx={{ paddingTop: 4, marginLeft: '240px' }}> {/* Adjust the left margin here */}
      {adminData ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Welcome {adminData.username}
          </Typography>

          {/* Displaying task analysis */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {loading ? <CircularProgress /> : taskCounts.totalTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Assigned Tasks
                  </Typography>
                  <Typography variant="h5" color="secondary">
                    {loading ? <CircularProgress /> : taskCounts.assigned}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    In Progress Tasks
                  </Typography>
                  <Typography variant="h5" color="warning">
                    {loading ? <CircularProgress /> : taskCounts.inProgress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Completed Tasks
                  </Typography>
                  <Typography variant="h5" color="success">
                    {loading ? <CircularProgress /> : taskCounts.completed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Error handling */}
          {error && (
            <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
              Error: {error}
            </Typography>
          )}
        </div>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
}
