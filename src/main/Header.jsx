import './header.css';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src="logo.png" alt="Project Logo" className="app-logo" /> {/* Replace "logo.png" with your logo file */}
        <h1 className="app-title">Task Management System</h1>
      </div>
    </header>
  );
}
