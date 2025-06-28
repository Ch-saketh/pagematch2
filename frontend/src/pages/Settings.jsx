import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSettings, FiLock, FiMonitor, FiArrowLeft } from 'react-icons/fi';
import '../styles/Settings.css';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storedProfileId = localStorage.getItem('selectedProfile');
  const storedProfileData = JSON.parse(localStorage.getItem('selectedProfileData'));

  const { profileId, profileData } = location.state || {
    profileId: storedProfileId,
    profileData: storedProfileData
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    displayName: profileData?.name || '',
    language: 'English',
    maturityRating: 'PG-13',
    autoplay: true
  });

  const [devices, setDevices] = useState([
    { id: 1, type: '📱', name: 'iPhone 13', lastActive: 'Today, 10:30 AM' },
    { id: 2, type: '💻', name: 'MacBook Pro', lastActive: 'Yesterday, 8:15 PM' },
    { id: 3, type: '📺', name: 'Samsung Smart TV', lastActive: 'June 25, 2023' }
  ]);

  useEffect(() => {
    if (!profileId || !profileData) {
      navigate('/profile');
    }
  }, [profileId, profileData, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignOutDevice = (deviceId) => {
    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
    navigate('/profile');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <FiArrowLeft /> Back to Profiles
        </button>
        <h1>
          Settings {profileData?.name ? `for ${profileData.name}` : ''}
        </h1>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FiSettings /> Profile
        </button>
        <button
          className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <FiLock /> Privacy
        </button>
        <button
          className={`settings-tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <FiMonitor /> Devices
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            <div className="settings-card">
              <h2>Profile Information</h2>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="form-control"
                  maxLength="20"
                />
              </div>
              <div className="form-group">
                <label>Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="avatar-options">
                  <img src={profileData?.avatar} alt="Current" className="current-avatar" />
                  <button type="button" className="change-avatar-btn" disabled>
                    Change Picture
                  </button>
                </div>
              </div>
            </div>
            <div className="settings-card">
              <h2>Playback Settings</h2>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="autoplay"
                  name="autoplay"
                  checked={formData.autoplay}
                  onChange={handleInputChange}
                />
                <label htmlFor="autoplay">Autoplay next episode</label>
              </div>
              <div className="form-group">
                <label>Maturity Rating</label>
                <select
                  name="maturityRating"
                  value={formData.maturityRating}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="G">G - All Ages</option>
                  <option value="PG">PG - Parental Guidance</option>
                  <option value="PG-13">PG-13 - Teens 13+</option>
                  <option value="R">R - Mature 17+</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="settings-content">
          <div className="settings-card">
            <h2>Privacy Settings</h2>
            <div className="form-group">
              <label>Viewing Activity</label>
              <p>Manage the titles you've watched on Page Match NEW</p>
              <button className="btn btn-secondary">View Activity</button>
            </div>
            <div className="form-group">
              <label>Download History</label>
              <p>Manage your download history and preferences</p>
              <button className="btn btn-secondary">Download History</button>
            </div>
            <div className="form-group">
              <label>Parental Controls</label>
              <p>Restrict content by maturity rating</p>
              <div className="parental-controls">
                <select
                  className="form-control"
                  value={formData.maturityRating}
                  onChange={handleInputChange}
                >
                  <option value="G">G - All Ages</option>
                  <option value="PG">PG - Parental Guidance</option>
                  <option value="PG-13">PG-13 - Teens 13+</option>
                  <option value="R">R - Mature 17+</option>
                </select>
                <button className="btn btn-secondary">Set PIN</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="settings-content">
          <div className="settings-card">
            <h2>Device Management</h2>
            <p>These are the devices currently signed in to your Page Match NEW account.</p>
            <div className="devices-list">
              {devices.map((device) => (
                <div key={device.id} className="device-item">
                  <div className="device-info">
                    <div className="device-icon">{device.type}</div>
                    <div>
                      <h3>{device.name}</h3>
                      <p>Last active: {device.lastActive}</p>
                    </div>
                  </div>
                  <div className="device-actions">
                    <button
                      onClick={() => handleSignOutDevice(device.id)}
                      className="btn btn-text"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="settings-card">
            <h2>Download Devices</h2>
            <p>Manage devices authorized for downloads</p>
            <button className="btn btn-secondary">Manage Download Devices</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
