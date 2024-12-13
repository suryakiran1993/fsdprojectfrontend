import { useState, useEffect } from 'react';
import axios from 'axios';
import Config from '../Config';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${Config.url}/viewallusers`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    const result = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const deleteUser = async (id) => {
    try {
      const isconfirmed = window.confirm("Are you sure you want to delete this user?");
      if (isconfirmed) {
        const response = await axios.delete(`${Config.url}/deleteuser/${id}`);
        alert(response.data);
        fetchUsers();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto', maxWidth: '900px', marginLeft: '220px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        View Users
      </Typography>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <TextField
          label="Search by Name, Role, or Department"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            marginBottom: '20px',
          }}
        />
      </div>

      {/* Center the table */}
      <TableContainer component={Paper} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={user.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.contact}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => deleteUser(user.id)}>
                      <i className='fa fa-trash'></i>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">Data Not Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
