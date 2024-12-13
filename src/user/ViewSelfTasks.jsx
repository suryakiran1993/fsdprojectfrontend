import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import axios from "axios";
import Config from "../Config";

const ViewSelfTasks = () => {
  const [tasks, setTasks] = useState({
    ASSIGNED: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${Config.url}/getallselftasks`);
        const allTasks = response.data;

        console.log("API Response:", allTasks); // Debugging: Check the response from the API

        // Categorize tasks by status and filter based on assignedBy
        const categorizedTasks = {
          ASSIGNED: [],
          IN_PROGRESS: [],
          COMPLETED: [],
        };

        allTasks.forEach((task) => {
          // Check if the task was assigned by the current user
          if (task.assignedBy === userData?.id) {
            const status = task.status?.toUpperCase() || "ASSIGNED"; // Normalize status and provide a fallback
            if (categorizedTasks[status]) {
              categorizedTasks[status].push(task);
            }
          }
        });

        console.log("Categorized Tasks:", categorizedTasks); // Debugging: Check categorized tasks

        setTasks(categorizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (userData) {
      fetchTasks();
    }
  }, [userData]);

  const moveTask = async (id, newStatus) => {
    try {
      // Optimistically update the state before the API call
      const updatedTasks = { ...tasks };
      const taskToMove = Object.values(updatedTasks).flat().find((task) => task.id === id);
      if (taskToMove) {
        // Remove the task from its current status and add it to the new status
        for (const status in updatedTasks) {
          if (updatedTasks[status].some((task) => task.id === id)) {
            updatedTasks[status] = updatedTasks[status].filter((task) => task.id !== id);
            break;
          }
        }
        updatedTasks[newStatus].push(taskToMove);
      }
      setTasks(updatedTasks);

      // Call the API to update the task status
      const response = await axios.put(`${Config.url}/updateselftask`, {
        id,
        status: newStatus,
      });

      console.log("Task update response:", response); // Debugging: log the API response

      // Check for successful update
      if (response.status === 200) {
        console.log(`Task ${id} moved to ${newStatus}`);
      } else {
        console.error("Error updating task status:", response.data);
      }
    } catch (error) {
      console.error(`Error moving task to ${newStatus}:`, error);
      // Optionally reset the state or show an error message
      alert(`Failed to update task status. Please try again.`);
    }
  };

  const renderTaskCards = (taskList, currentStatus) => {
    // Define colors for different priorities
    const priorityColors = {
      LOW: "#d1e7dd", // Light green for low priority
      MEDIUM: "#fff3cd", // Light yellow for medium priority
      HIGH: "#f8d7da", // Light red for high priority
    };

    return taskList.map((task) => {
      const priority = task.priority?.toUpperCase() || "LOW"; // Default to LOW if priority is missing
      const cardBackgroundColor = priorityColors[priority] || "#f9f9f9"; // Fallback to a neutral color

      return (
        <Card
          key={task.id}
          sx={{
            marginBottom: 2,
            boxShadow: 3,
            backgroundColor: cardBackgroundColor,
            padding: 2,
          }}
        >
          <CardContent>
            <Typography variant="h6" component="div">
              {task.title || "Untitled Task"} {/* Fallback for missing title */}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ marginTop: 1 }}>
              Priority: {task.priority || "N/A"} {/* Fallback for priority */}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Start Date: {task.startDate || "N/A"} {/* Fallback for start date */}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              End Date: {task.endDate || "N/A"} {/* Fallback for end date */}
            </Typography>

            {/* Conditional rendering of buttons based on current task status */}
            {currentStatus === "ASSIGNED" && (
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => moveTask(task.id, "IN_PROGRESS")}
                disabled={task.status === "IN_PROGRESS"} // Disable if already in progress
              >
                Move to In Progress
              </Button>
            )}
            {currentStatus === "IN_PROGRESS" && (
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => moveTask(task.id, "COMPLETED")}
                disabled={task.status === "COMPLETED"} // Disable if already completed
              >
                Move to Completed
              </Button>
            )}
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {/* Sidebar content here (if needed) */}
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                Assigned
              </Typography>
              {tasks.ASSIGNED.length > 0 ? (
                renderTaskCards(tasks.ASSIGNED, "ASSIGNED")
              ) : (
                <Typography>No tasks available.</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                In Progress
              </Typography>
              {tasks.IN_PROGRESS.length > 0 ? (
                renderTaskCards(tasks.IN_PROGRESS, "IN_PROGRESS")
              ) : (
                <Typography>No tasks available.</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                Completed
              </Typography>
              {tasks.COMPLETED.length > 0 ? (
                renderTaskCards(tasks.COMPLETED, "COMPLETED")
              ) : (
                <Typography>No tasks available.</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewSelfTasks;
