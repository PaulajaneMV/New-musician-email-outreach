import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/Sidebar.css";

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className={`sidebar ${isMinimized ? "minimized" : ""}`}>
      <div className="sidebar-header">
        {!isMinimized && <h2>Musician Outreach</h2>}
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      <div className="sidebar-menu">
        <Link
          to="/dashboard"
          className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          {!isMinimized && <span>Dashboard</span>}
        </Link>

        <Link
          to="/email-campaigns"
          className={`sidebar-item ${location.pathname === "/email-campaigns" ? "active" : ""}`}
        >
          {!isMinimized && <span>Email Campaigns</span>}
        </Link>

        <Link
          to="/analytics"
          className={`sidebar-item ${location.pathname === "/analytics" ? "active" : ""}`}
        >
          {!isMinimized && <span>Analytics</span>}
        </Link>

        <Link
          to="/tasks"
          className={`sidebar-item ${location.pathname === "/tasks" ? "active" : ""}`}
        >
          {!isMinimized && <span>Tasks</span>}
        </Link>

        <Link
          to="/profile"
          className={`sidebar-item ${location.pathname === "/profile" ? "active" : ""}`}
        >
          {!isMinimized && <span>Profile</span>}
        </Link>

        <Link
          to="/settings"
          className={`sidebar-item ${location.pathname === "/settings" ? "active" : ""}`}
        >
          {!isMinimized && <span>Settings</span>}
        </Link>

        <Link
          to="/help"
          className={`sidebar-item ${location.pathname === "/help" ? "active" : ""}`}
        >
          {!isMinimized && <span>Help</span>}
        </Link>

        {/* Add Payment Page Link */}


        <button className="sidebar-item logout-btn" onClick={handleLogout}>
          {!isMinimized && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
