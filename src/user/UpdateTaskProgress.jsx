import { useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button} from '@mui/material';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Config from '../Config';

const UpdateTaskProgress = () => {
  const { state } = useLocation();
  const { task } = state;

  const [userData, setUserData] = useState(null);

  const [progress, setProgress] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [remarks, setRemarks] = useState('');

    // Fetch user data from localStorage
    useEffect(() => {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    }, []);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!progress || !pdfFile) {
      alert('Please provide progress and select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('taskid', task.id);
    formData.append('progress', progress);
    formData.append('progressfile', pdfFile);
    formData.append('remarks', remarks);  // Adding remarks to the form data
    formData.append('updatedBy', userData.id);  // Adding updatedBy to the form data

    try {
      const response = await axios.post(`${Config.url}/updatetaskprogress`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      alert(response.data);
      setProgress('');
      setRemarks('');
      setPdfFile(null);
    } 
    catch (error) 
    {
      console.error('Error updating progress:', error);
      alert('Failed to update task progress');
    }
  };

  return (
    <Box sx={{ padding: 4, width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5', marginBottom: 3 }}>
        Update Task Progress
      </Typography>
      {/* <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Task ID: {task.id} - {task.name}
      </Typography> */}

      <TextField
  label="Progress (%)"
  variant="outlined"
  fullWidth
  value={progress}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setProgress(value); // Allow only numbers and decimals
    }
  }}
  inputProps={{
    min: 10,
    max: 100,
    step: 0.1,
  }}
  helperText="Enter a value between 10 and 100"
  sx={{ marginBottom: 2 }}
/>


      <TextField
        label="Remarks"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        Upload Progress Report (PDF only):
      </Typography>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ marginBottom: '20px', width: '100%' }}
      />

 

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        sx={{ marginTop: 2, padding: '12px' }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default UpdateTaskProgress;
