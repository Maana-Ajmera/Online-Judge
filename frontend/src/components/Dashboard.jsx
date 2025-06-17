import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Rtime</h1>
        <p>Hello, {user?.username}! Ready to solve some problems?</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Problems</h3>
            <p>Browse and solve coding problems</p>
            <button className="dashboard-btn">View Problems</button>
          </div>

          <div className="dashboard-card">
            <h3>Submissions</h3>
            <p>View your submission history</p>
            <button className="dashboard-btn">View Submissions</button>
          </div>

          <div className="dashboard-card">
            <h3>Leaderboard</h3>
            <p>See how you rank among other users</p>
            <button className="dashboard-btn">View Leaderboard</button>
          </div>

          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>Manage your account settings</p>
            <button className="dashboard-btn">Edit Profile</button>
          </div>
        </div>

        <div className="user-stats">
          <h2>Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Problems Solved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Total Submissions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">--</span>
              <span className="stat-label">Rank</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
