import { Route, Routes, Link, useNavigate } from 'react-router-dom';

import AdminHome from './AdminHome';
import ViewUsers from './ViewUsers';
import ViewUserProfile from './ViewUserProfile';
import AddUser from './AddUser';

export default function AdminNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin');
    navigate('/adminlogin');
    window.location.reload()
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/adminhome">Dashboard</Link></li>
          <li><Link to="/adminhome">Dashboard</Link></li>
          <li><Link to="/adduser">Add User</Link></li>
          <li><Link to="/viewusers">View Users</Link></li>
          <li><Link onClick={handleLogout}>Logout</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/adminhome" element={<AdminHome />} exact />
        <Route path="/adduser" element={<AddUser/>} exact />
        <Route path="/viewusers" element={<ViewUsers/>} exact />
        <Route path="/viewuserprofile/:email" element={<ViewUserProfile/>} exact />
      </Routes>
    </div>
  );
}
