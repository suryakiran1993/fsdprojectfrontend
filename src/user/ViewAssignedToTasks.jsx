import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, LinearProgress, TextField } from '@mui/material';
import axios from 'axios';
import Config from '../Config';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Importing the AccessTime icon
import { format } from 'date-fns'; // For formatting the date

const ViewAssignedToTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [assignedUsers, setAssignedUsers] = useState({}); // Store user names by ID
  const navigate = useNavigate();

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  // Fetch tasks when userData.id is available
  useEffect(() => {
    if (userData && userData.id) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${Config.url}/gettasksassignedto/${userData.id}`);
          if (response.data) {
            setTasks(response.data);
            setFilteredTasks(response.data); // Initially set filtered tasks to all tasks

            // Fetch user details for assignedTo
            const userIds = response.data.map(task => task.assignedBy);
            const uniqueUserIds = [...new Set(userIds)]; // Get unique user IDs

            const usersData = await Promise.all(
              uniqueUserIds.map(async (userId) => {
                const userResponse = await axios.get(`${Config.url}/getuserbyid/${userId}`);
                return { id: userId, name: userResponse.data.name };
              })
            );

            // Map the user data to their respective IDs
            const usersMap = usersData.reduce((acc, user) => {
              acc[user.id] = user.name;
              return acc;
            }, {});

            setAssignedUsers(usersMap);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
          alert('Failed to fetch tasks.');
        }
      };

      fetchTasks();
    }
  }, [userData]);

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter tasks based on search term
    const filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(value.toLowerCase()) ||
      task.category.toLowerCase().includes(value.toLowerCase()) ||
      task.subcategory.toLowerCase().includes(value.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  // Function to calculate the days between two dates
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return diffTime / (1000 * 3600 * 24); // Convert milliseconds to days
  };

  // Function to calculate the progress of the task
  const calculateProgress = (startDate, endDate) => {
    const currentDate = new Date();
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);

    // Calculate the progress as a percentage
    const progress = Math.min(
      Math.max((currentDate - taskStart) / (taskEnd - taskStart), 0), // Clamp value between 0 and 1
      1
    );

    return progress * 100; // Return as percentage
  };

  // Function to determine the background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ff4d4d'; // Red
      case 'Medium':
        return 'orange'; // Yellow
      case 'Low':
        return '#66cc66'; // Green
      default:
        return '#f5f5f5'; // Default gray
    }
  };

  // Function to format date
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy'); // Format date as "dd MMM yyyy"
  };

  const handleUpdateProgress = async (task) => {
    try {
      const response = await axios.get(`${Config.url}/myreviewtaskprogress/${task.id}`);
      const taskProgressData = response.data;
      const isSubmitted = taskProgressData.some((progress) => progress.reviewstatus === 'SUBMITTED FOR REVIEW');

      if (isSubmitted) {
        alert('You are not allowed to update progress as this task is already submitted for review.');
      } else {
        navigate('/updatetaskprogress', { state: { task } });
      }
    } catch (error) {
      console.error('Error checking review status:', error);
      alert('An error occurred while checking the task progress.');
    }
  };

  const handleReviewProgress = (task) => {
    navigate('/myreviewtaskprogress', { state: { task } });
  };

  return (
    <Box sx={{ padding: 5, marginLeft: '250px' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5' }}>
        Tasks By Others
      </Typography>

      {/* Show search bar only if tasks are available */}
      {filteredTasks.length > 0 && (
        <TextField
          label="Search Tasks"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />
      )}

      {/* Show a message if no tasks are available */}
      {filteredTasks.length === 0 ? (
        <Typography variant="body1" sx={{ color: '#f44336', textAlign: 'center' }}>
          No tasks available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => {
            const totalDays = calculateDays(task.startDate, task.endDate);
            const progress = calculateProgress(task.startDate, task.endDate);
            const daysLeft = Math.max(0, Math.ceil(totalDays - (new Date() - new Date(task.startDate)) / (1000 * 3600 * 24)));

            return (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card sx={{ height: '100%', backgroundColor: getPriorityColor(task.priority) }}>
                  <CardContent>
                    <Typography variant="h6">{task.name}</Typography>
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                      Description: {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <AccessTimeIcon sx={{ marginRight: 1 }} />
                      <Typography variant="body2">
                        Start Date: {task.startDate ? formatDate(task.startDate) : 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <AccessTimeIcon sx={{ marginRight: 1 }} />
                      <Typography variant="body2">
                        End Date: {task.endDate ? formatDate(task.endDate) : 'N/A'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Assigned By: {assignedUsers[task.assignedBy] || 'Loading...'}
                    </Typography>
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Duration: {daysLeft} Days Left
                      </Typography>
                      <LinearProgress variant="determinate" value={progress} sx={{ marginBottom: 1 }} />
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateProgress(task)}
                      sx={{ marginTop: 2, marginRight: 1 }}
                    >
                      Update Progress
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleReviewProgress(task)}
                      sx={{ marginTop: 2 }}
                    >
                      Progress Updates
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default ViewAssignedToTasks;
