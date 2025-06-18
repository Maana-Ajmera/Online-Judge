import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import {
  FaHome,
  FaCode,
  FaTrophy,
  FaUser,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";

const navItems = [
  { key: "home", label: "Home", icon: <FaHome /> },
  { key: "problems", label: "Problems", icon: <FaCode /> },
  { key: "submissions", label: "Submissions", icon: <FaHistory /> },
  { key: "leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
  { key: "profile", label: "Profile", icon: <FaUser /> },
];

const codeSample = `function sum(a, b) {
  return a + b;
}

console.log(sum(2, 3)); // 5`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("home");
  const [code, setCode] = useState(codeSample);

  const renderContent = () => {
    switch (activeNav) {
      case "problems":
        return (
          <div className="dashboard-section">
            <h2>Problems</h2>
            <p>Browse and solve coding problems.</p>
          </div>
        );
      case "submissions":
        return (
          <div className="dashboard-section">
            <h2>Submissions</h2>
            <p>View your submission history.</p>
          </div>
        );
      case "leaderboard":
        return (
          <div className="dashboard-section">
            <h2>Leaderboard</h2>
            <p>See how you rank among other users.</p>
          </div>
        );
      case "profile":
        return (
          <div className="dashboard-section">
            <h2>Profile</h2>
            <p>Manage your account settings.</p>
          </div>
        );
      default:
        return (
          <div className="dashboard-main-content">
            <h1>Online Judge</h1>
            <h3>Onptjend Design</h3>
            <div className="code-editor-glass">
              <div className="code-editor-header">
                <span>Padge</span>
              </div>
              <textarea
                className="code-editor-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-glass-bg">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo"></div>
        <nav>
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-nav-item${
                activeNav === item.key ? " active" : ""
              }`}
              onClick={() => setActiveNav(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">It's Rtime!</div>
          <div className="topbar-actions">
            <span className="topbar-user">{user?.username}</span>
            <button className="topbar-btn" onClick={logout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </header>
        <section className="dashboard-content-area">{renderContent()}</section>
      </main>
    </div>
  );
};

export default Dashboard;
