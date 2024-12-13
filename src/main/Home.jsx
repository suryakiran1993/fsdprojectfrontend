import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import './style.css';

export default function Home() {
  return (
    <div>
      <section style={{ marginTop: '40px' }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Task Card 1: Task Creation */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                alt="Task Creation"
                height="200"
                image="one.png" // Task Creation Image
                sx={{ objectFit: 'contain', width: '100%' }} // Prevent stretching and maintain aspect ratio
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Creation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This feature allows users to create new tasks. Users can enter task details such as the title, description, and deadline. Once created, tasks are added to the task list for further actions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Task Card 2: Task Assignment */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                alt="Task Assignment"
                height="200"
                image="two.png" // Task Assignment Image
                sx={{ objectFit: 'contain', width: '100%' }} // Prevent stretching and maintain aspect ratio
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Assignment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After creating a task, it can be assigned to a specific team member. The assigned user receives notifications and updates regarding the task’s progress, ensuring efficient task management within teams.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Task Card 3: Task Tracking */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                alt="Task Tracking"
                height="200"
                image="three.png" // Task Tracking Image
                sx={{ objectFit: 'contain', width: '100%' }} // Prevent stretching and maintain aspect ratio
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The task tracking feature enables users to track the status of tasks in real-time. This includes progress monitoring, completion percentage, and due dates to keep tasks on schedule and ensure deadlines are met.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    </div>
  );
}
