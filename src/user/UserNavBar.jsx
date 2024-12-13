import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import UserHome from './UserHome';
import UserProfile from './UserProfile';
import UpdateUserProfile from './UpdateUserProfile';
import AddTask from './AddTask';
import ViewAssignedToTasks from './ViewAssignedToTasks';
import ViewAssignedByTasks from './ViewAssignedByTasks';
import UpdateTaskProgress from './UpdateTaskProgress';
import MyTaskProgressUpdates from './MyTaskProgressUpdates';
import ViewTaskUpdates from './ViewTaskUpdates';
import AddSelfTask from './AddSelfTask';
import ViewSelfTasks from './ViewSelfTasks';

export default function UserNavBar() 
{
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('user');

    navigate('/userlogin');
    window.location.reload()
  };

  return (
    <div>
      <nav>
  <ul>
    
    <li><Link to="/userhome">Dashboard</Link></li> 

    <li><Link to="/updateuserprofile">Edit Profile</Link></li>  {/* Changed "Update Profile" to "Edit Profile" */}
    <li><Link to="/addselftask">Add Task</Link></li>
    <li><Link to="/viewselftasks">View Self Tasks</Link></li>
    <li><Link to="/addtask">Assign Task to Others</Link></li>
    <li><Link to="/viewassignedbytasks">My Assigned Tasks</Link></li>  {/* Updated name for clarity */}
    <li><Link to="/viewassignedtotasks">Tasks Assigned To Me</Link></li>  {/* Updated name for clarity */}
    <li><Link onClick={handleLogout}>Log Out</Link></li>  {/* Changed "Logout" to "Log Out" */}
  </ul>
</nav>

      <Routes>
        <Route path="/userhome" element={<UserHome/>} exact />
        <Route path="/viewuserprofile" element={<UserProfile/>} exact />
        <Route path="/updateuserprofile" element={<UpdateUserProfile/>} exact />
        <Route path="/addtask" element={<AddTask/>} exact />
        <Route path="/viewassignedtotasks" element={<ViewAssignedToTasks/>} exact />
        <Route path="/viewassignedbytasks" element={<ViewAssignedByTasks/>} exact />
        <Route path="/updatetaskprogress" element={<UpdateTaskProgress/>} exact />
        <Route path="/myreviewtaskprogress" element={<MyTaskProgressUpdates/>} exact/>
        <Route path="/viewtaskupdates" element={<ViewTaskUpdates/>} exact/>

        <Route path="/addselftask" element={<AddSelfTask/>} exact/>
        <Route path="/viewselftasks" element={<ViewSelfTasks/>} exact/>
      </Routes>
    </div>
  );
}
