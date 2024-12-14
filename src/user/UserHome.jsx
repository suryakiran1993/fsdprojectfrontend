import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../Config';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Paper,
} from '@mui/material';

export default function UserHome() {
  const [userData, setUserData] = useState("");
  const [tasks, setTasks] = useState([]); // State to store tasks

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
          const response = await axios.get(`${Config.url}/gettasksassignedto/${userData.id}`);
          if (response.data) {
            setTasks(response.data);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [userData]);

  return (
    <Box
      sx={{
        marginLeft: '250px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      {userData ? (
        <Box>
          <Card
            sx={{
              marginBottom: '20px',
              backgroundColor: '#1976d2',
              color: '#fff',
              padding: '15px',
              borderRadius: '10px',
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Welcome, {userData.name} [{userData.role}]
              </Typography>
            </CardContent>
          </Card>

          {/* Display tasks and their statuses */}
          <Box>
            {tasks.length > 0 ? (
              <Card sx={{ padding: '15px', borderRadius: '10px' }}>
                <Typography variant="h5" gutterBottom>
                  Your Assigned Tasks:
                </Typography>
                <List>
                  {tasks.map((task) => (
                    <Paper
                      key={task.id}
                      elevation={3}
                      sx={{
                        marginBottom: '10px',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#e3f2fd',
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="h6" color="#1976d2">
                              {task.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              Status: {task.status}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </Paper>
                  ))}
                </List>
              </Card>
            ) : (
              <Typography
                variant="body1"
                sx={{ marginTop: '20px', color: '#555' }}
              >
                No tasks assigned to you.
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="h4" color="textSecondary">
          Loading...
        </Typography>
      )}
    </Box>
  );
}
