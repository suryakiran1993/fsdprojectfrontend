import PropTypes from 'prop-types';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './style.css';
import UserLogin from '../user/UserLogin';
import Contact from './Contact';
import AdminLogin from '../admin/AdminLogin';
import PageNotFound from './PageNotFound';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

export default function MainNavBar({ onAdminLogin, onUserLogin }) {
  return (
    <div className="navbar-container">
      <nav className="main-nav">
        <ul>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li className="dropdown">
            <Link to="#" className="nav-link">Login</Link>
            <div className="dropdown-content">
              <Link to="/userlogin">User Login</Link>
              <Link to="/adminlogin">Admin Login</Link>
            </div>
          </li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} exact />
          
          <Route path="/about" element={<About />} exact />
          <Route path="/userlogin" element={<UserLogin onUserLogin={onUserLogin} />} exact />
          <Route path="/adminlogin" element={<AdminLogin onAdminLogin={onAdminLogin} />} exact />
          <Route path="/contact" element={<Contact />} exact />

          {/* Forgot Password */}
          <Route path="/forgotpassword" element={<ForgotPassword />} exact />

          {/* Reset Password */}
          <Route
            path="/resetpassword"
            element={<ResetPassword />}
          />

          {/* Page Not Found */}
          <Route path="*" element={<PageNotFound />} exact />
        </Routes>
      </div>
    </div>
  );
}

MainNavBar.propTypes = {
  onAdminLogin: PropTypes.func.isRequired,
  onUserLogin: PropTypes.func.isRequired,
};
