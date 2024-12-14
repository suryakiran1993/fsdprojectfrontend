import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import Config from '../Config';

export default function AddTask() {
  const [task, setTask] = useState({
    category: '',
    subcategory: '',
    name: '',
    description: '',
    priority: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    remarks: '',
  });

  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);

  const subcategories = {
    Academics: ['Timetable', 'Result Analysis', 'Registrations'],
    Research: ['Publications', 'Consultancy', 'Patents'],
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      // Check if the role is either 'Principal' or 'HOD'
      if (parsedUserData.role === 'PRINCIPAL' || parsedUserData.role === 'HOD') {
        setHasAccess(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        const response = await axios.get(`${Config.url}/getallusers`);
        if (response.data) {
          setUsers(response.data);
  
          // Role-based filtering
          const filtered = response.data.filter((user) => {
            // Exclude the current user's ID
            if (user.id === userData.id) return false;
  
            // Role-based filtering
            if (userData.role === 'PRINCIPAL') {
              return user.role === 'HOD' || user.role === 'FACULTY';
            } else if (userData.role === 'HOD') {
              return user.role === 'FACULTY';
            }
  
            return false;
          });
  
          setFilteredUsers(filtered);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users.');
      }
    };
  
    fetchFacultyList();
  }, [userData]); // Rerun if userData changes
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });

    // Clear subcategory if category changes
    if (name === 'category') {
      setTask((prev) => ({ ...prev, subcategory: '' }));
    }

    // Filter users based on assignedTo input
    if (name === 'assignedTo') {
      const searchTerm = value.toLowerCase();

      // Filter users based on either id or name
      const filtered = users.filter((user) => {
        const userIdAndName = `${user.id} - ${user.name}`.toLowerCase();
        return userIdAndName.includes(searchTerm); // Case-insensitive match
      });

      setFilteredUsers(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskWithDefaults = {
        ...task,
        assignedBy: userData.id,
        status: 'ASSIGNED', // Default status
      };

      const response = await axios.post(`${Config.url}/addtask`, taskWithDefaults);

      if (response.status) {
        alert(response.data);
        setTask({
          category: '',
          subcategory: '',
          name: '',
          description: '',
          priority: '',
          startDate: '',
          endDate: '',
          assignedTo: '',
          remarks: '',
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  if (!hasAccess) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
        <Typography variant="h6" sx={{ color: 'red' }}>
          Access Denied: You do not have permission to add tasks.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        padding: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          width: '100%',
          bgcolor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 3 }}>
          Add Task
        </Typography>

        <TextField
  name="category"
  label="Task Category"
  value={task.category}
  onChange={handleChange}
  fullWidth
  required
  select
  sx={{ marginBottom: 2 }}
  SelectProps={{
    native: true,
  }}
  InputLabelProps={{
    shrink: true,
  }}
>
  <option value="">---Select---</option> {/* Add this line for the "Select" option */}
  <option value="Academics">Academics</option>
  <option value="Research">Research</option>
</TextField>


        {/* Subcategory */}
        {task.category && (
          <TextField
            name="subcategory"
            label="Subcategory"
            value={task.subcategory}
            onChange={handleChange}
            fullWidth
            required
            select
            sx={{ marginBottom: 2 }}
            SelectProps={{
              native: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {subcategories[task.category].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </TextField>
        )}

        {/* Task Name */}
        <TextField
          name="name"
          label="Task Name"
          value={task.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            marginBottom: 2,
            '& .MuiInputBase-root': {
              height: 50,
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Task Description */}
        <TextField
          name="description"
          label="Task Description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          required
          sx={{
            marginBottom: 2,
            '& .MuiInputBase-root': {
              height: 120, // Adjusting for multiline input
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Priority */}
        <TextField
          name="priority"
          label="Priority"
          value={task.priority}
          onChange={handleChange}
          fullWidth
          required
          select
          sx={{ marginBottom: 2 }}
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </TextField>

<TextField
  name="startDate"
  label="Start Date"
  type="date"
  value={task.startDate}
  onChange={handleChange}
  fullWidth
  required
  InputLabelProps={{ shrink: true }}
  sx={{ marginBottom: 2 }}
  InputProps={{
    inputProps: {
      min: new Date().toISOString().split('T')[0], // Sets the minimum date to today
    }
  }}
/>


<TextField
  name="endDate"
  label="End Date"
  type="date"
  value={task.endDate}
  onChange={handleChange}
  fullWidth
  required
  InputLabelProps={{ shrink: true }}
  sx={{ marginBottom: 2 }}
  InputProps={{
    inputProps: {
      min: new Date().toISOString().split('T')[0], // Sets the minimum date to today
    }
  }}
/>

        {/* Assign To */}
        <TextField
          name="assignedTo"
          label="Assign To"
          value={task.assignedTo}
          onChange={handleChange}
          fullWidth
          required
          select
          sx={{
            marginBottom: 2,
            '& .MuiInputBase-root': {
              height: 50,
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {filteredUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {`${user.id} - ${user.name} [${user.role}]`}
            </MenuItem>
          ))}
        </TextField>

        {/* Remarks */}
        <TextField
          name="remarks"
          label="Remarks/Comments"
          value={task.remarks}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{
            marginBottom: 2,
            '& .MuiInputBase-root': {
              height: 100,
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ padding: 1.5, marginTop: 2 }}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
}
