import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Config from "../Config";

const AddSelfTask = () => {
  const [userData, setUserData] = useState({});
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "",
    startDate: "",
    endDate: "",
    status: "ASSIGNED",
    assignedBy: null, // Initially set as null
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  // Update `assignedBy` whenever `userData` is updated
  useEffect(() => {
    if (userData && userData.id) {
      setTaskData((prevData) => ({
        ...prevData,
        assignedBy: userData.id,
      }));
    }
  }, [userData]);

  const priorities = ["Low", "Medium", "High"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Config.url}/addselftask`, taskData);
      console.log("Task added successfully", response.data);
      alert("Task added successfully!");
      setTaskData({
        title: "",
        description: "",
        priority: "",
        startDate: "",
        endDate: "",
        status: "ASSIGNED",
        assignedBy: userData.id, // Reset the assignedBy field after submission
      });
    } catch (error) {
      console.error("Error adding task", error);
      alert("Failed to add task. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Self Task
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 500,
          gap: 2,
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <TextField
          label="Title"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <TextField
          select
          label="Priority"
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          required
        >
          {priorities.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={taskData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          inputProps={{ min: today }} // Disable previous dates for startDate
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={taskData.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          inputProps={{ min: today }} // Disable previous dates for endDate
        />
        <Button type="submit" variant="contained" color="primary" size="large">
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

export default AddSelfTask;
