import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Modal,
  Box,
  TextField,
} from '@mui/material';
import axios from 'axios';
import Config from '../Config';

const ViewTaskUpdates = () => {
  const { state } = useLocation();
  const { task } = state;

  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedProgressId, setSelectedProgressId] = useState(null); // Track progressId
  const [progress, setProgress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Fetch task progress updates
  useEffect(() => {
    if (!userData) return;

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
  }, [userData, task.id]);

  // Handle file download
  const downloadFile = async (id) => {
    try {
      const response = await axios.get(`${Config.url}/downloadprogressfile/${id}`, {
        responseType: 'blob',
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
        alert(`No file found for Progress ID: ${id}`);
      }
    } catch (err) {
      console.error(`Failed to download file for Progress ID: ${id}`, err);
      alert('Failed to download file. Please try again.');
    }
  };

  // Open review modal
  const handleReviewOpen = (progressId, taskId) => {
    setSelectedProgressId(progressId); // Track progressId
    setSelectedTaskId(taskId);
    setProgress('');
    setRemarks(''); // Ensure the remarks field is blank
    setOpenReviewModal(true);
  };

  // Close review modal
  const handleReviewClose = () => {
    setOpenReviewModal(false);
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (progress === null || progress < 0 || progress > 100 || !remarks.trim()) {
      alert('Please enter valid progress (0-100) and remarks.');
      return;
    }

    setIsSubmitting(true);

    const updateData = {
      progressid: selectedProgressId, // Include progressId
      taskid: selectedTaskId,
      progress: Number(progress),
      remarks,
    };

    console.log(updateData)

    try {
      const response = await axios.put(`${Config.url}/updatetask`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        alert('Task progress updated successfully!');
        setOpenReviewModal(false);
        setProgress(''); // Reset to blank
        setRemarks('');
        // Refresh task progress updates
        const updatedProgress = await axios.get(`${Config.url}/myreviewtaskprogress/${task.id}`);
        setProgressUpdates(updatedProgress.data);
      }
    } catch (err) {
      console.error('Error updating task progress', err);
      alert('Failed to update task progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  // Render error state
  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', marginTop: 2 }}>{error}</Typography>;
  }

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 4,
          marginLeft: { xs: 0, sm: '240px' },
          padding: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          width: { xs: '100%', sm: 'calc(100% - 240px)' },
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
          Task Progress Updates
        </Typography>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Progress ID</strong></TableCell>
              <TableCell><strong>Task ID</strong></TableCell>
              <TableCell><strong>Progress (%)</strong></TableCell>
              <TableCell><strong>Remarks</strong></TableCell>
              <TableCell><strong>Progress File</strong></TableCell>
              <TableCell><strong>Updated Time</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progressUpdates.map((update) => (
              <TableRow
                key={update.id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                  '&:hover': { backgroundColor: '#f1f1f1' },
                }}
              >
                <TableCell>{update.id}</TableCell>
                <TableCell>{update.taskid}</TableCell>
                <TableCell>{update.progress}%</TableCell>
                <TableCell>{update.remarks || 'N/A'}</TableCell>
                <TableCell>
                  {update.hasFile ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => downloadFile(update.id)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Download
                    </Button>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No File
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{new Date(update.progressUpdatedTime).toLocaleString()}</TableCell>
                <TableCell>{update.reviewstatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleReviewOpen(update.id, update.taskid)}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Task Modal */}
      <Modal
        open={openReviewModal}
        onClose={handleReviewClose}
        aria-labelledby="task-review-modal"
        aria-describedby="task-progress-review"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 4,
            borderRadius: '8px',
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Review Task - {selectedTaskId !== null ? selectedTaskId : 'N/A'}
          </Typography>
          <TextField
            label="Progress (%)"
            type="number"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleSubmitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewTaskUpdates;
