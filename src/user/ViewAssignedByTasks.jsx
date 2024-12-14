import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Config from '../Config';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Importing the AccessTime icon
import { format } from 'date-fns'; // For formatting the date

const ViewAssignedByTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // New state for status filter
  const [assignedUsers, setAssignedUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  useEffect(() => {
    if (userData && userData.id) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${Config.url}/gettasksassignedby/${userData.id}`);
          if (response.data) {
            setTasks(response.data);
            setFilteredTasks(response.data);

            const userIds = response.data.map(task => task.assignedTo);
            const uniqueUserIds = [...new Set(userIds)];

            const usersData = await Promise.all(
              uniqueUserIds.map(async (userId) => {
                const userResponse = await axios.get(`${Config.url}/getuserbyid/${userId}`);
                return { id: userId, name: userResponse.data.name };
              })
            );

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

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (searchTerm, statusFilter) => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredTasks(filtered);
  };

  const handleViewProgress = (task) => {
    navigate('/viewtaskupdates', { state: { task } });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f44336'; // Red
      case 'Medium':
        return '#ff9800'; // Orange
      case 'Low':
        return '#4caf50'; // Green
      default:
        return '#f5f5f5'; // Default color if no priority
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy');
  };

  return (
    <Box sx={{ padding: 5, marginLeft: '250px' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5' }}>
        Tasks Assigned By Me
      </Typography>

      {tasks.length > 0 && (
        <>
          <TextField
            label="Search Tasks"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={handleStatusChange}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="IN PROGRESS">IN PPROGRESS</MenuItem>
              <MenuItem value="ASSIGNED">ASSIGNED</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {tasks.length === 0 ? (
        <Typography variant="body1" color="red" sx={{ textAlign: 'center' }}>
          You have no tasks assigned.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
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
                    Assigned To: {assignedUsers[task.assignedTo] || 'Loading...'}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Status: {task.status}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={() => handleViewProgress(task)}
                  >
                    View Task Progress Updates
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ViewAssignedByTasks;
