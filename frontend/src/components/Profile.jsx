import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile, changePassword, error, clearError } = useAuth();

  const [profileFormData, setProfileFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setMessage(error);
      const timer = setTimeout(() => {
        setMessage(null);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileFormData.username) {
      newErrors.username = "Username is required";
    } else if (profileFormData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileFormData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }
    if (!profileFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileFormData.email)) {
      newErrors.email = "Email is invalid";
    }
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordFormData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordFormData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordFormData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }
    if (!passwordFormData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm new password is required";
    } else if (
      passwordFormData.newPassword !== passwordFormData.confirmNewPassword
    ) {
      newErrors.confirmNewPassword = "New passwords do not match";
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) {
      return;
    }

    setIsProfileSubmitting(true);
    try {
      const result = await updateProfile(profileFormData);
      if (result.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("An unexpected error occurred during profile update.");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const result = await changePassword(
        passwordFormData.currentPassword,
        passwordFormData.newPassword
      );
      if (result.success) {
        setMessage("Password changed successfully!");
        setPasswordFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setMessage(result.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Password change error:", err);
      setMessage("An unexpected error occurred during password change.");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  if (!user) {
    return <p>Loading profile...</p>; // Or redirect to login
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {message && (
        <div className={`message ${error ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <div className="profile-sections">
        {/* Update Profile Section */}
        <div className="profile-card">
          <h3>Update Profile</h3>
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profileFormData.username}
                onChange={handleProfileChange}
                className={profileErrors.username ? "error" : ""}
                disabled={isProfileSubmitting}
              />
              {profileErrors.username && (
                <span className="error-text">{profileErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileFormData.email}
                onChange={handleProfileChange}
                className={profileErrors.email ? "error" : ""}
                disabled={isProfileSubmitting}
              />
              {profileErrors.email && (
                <span className="error-text">{profileErrors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="profile-button"
              disabled={isProfileSubmitting}
            >
              {isProfileSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="profile-card">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordFormData.currentPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.currentPassword ? "error" : ""}
                disabled={isPasswordSubmitting}
              />
              {passwordErrors.currentPassword && (
                <span className="error-text">
                  {passwordErrors.currentPassword}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordFormData.newPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.newPassword ? "error" : ""}
                disabled={isPasswordSubmitting}
              />
              {passwordErrors.newPassword && (
                <span className="error-text">{passwordErrors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordFormData.confirmNewPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.confirmNewPassword ? "error" : ""}
                disabled={isPasswordSubmitting}
              />
              {passwordErrors.confirmNewPassword && (
                <span className="error-text">
                  {passwordErrors.confirmNewPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="profile-button"
              disabled={isPasswordSubmitting}
            >
              {isPasswordSubmitting ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
