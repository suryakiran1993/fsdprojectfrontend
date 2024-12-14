import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import Config from "../Config";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize the navigate function
  const email = searchParams.get("email"); // Extract email from the query params
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Config.url}/resetpassword`, {
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setMessage("Password reset successful! Redirecting to login...");
      
      // Reset the form fields
      setFormData({ password: "", confirmPassword: "" });

      // Redirect to UserLogin after a short delay
      setTimeout(() => {
        navigate("/userlogin");
      }, 2000); // 2-second delay
    } catch (error) {
      setMessage(
        error.response?.data || "An error occurred. Please try again later."
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Reset Password
      </Typography>
      {message && (
        <Typography variant="h6" align="center" color="primary" gutterBottom>
          {message}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="New Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ padding: "10px" }}
        >
          Reset Password
        </Button>
      </form>
    </Box>
  );
}
