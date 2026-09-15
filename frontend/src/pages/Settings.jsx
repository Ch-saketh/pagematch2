import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSliders, FiShield, FiCpu, FiArrowLeft, FiCheck, FiMonitor, FiUploadCloud, FiImage } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { processUserAvatar } from '../utils/imageHelper';
import '../styles/Settings.css';
import '../styles/ProfileSelection.css';

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
    maturityRating: 'All Ages',
    dynamicDiscovery: true,
    recommendationMode: 'hybrid',
    explorationWeight: '70'
  });

  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(profileData?.avatar || null);
  const [avatarTab, setAvatarTab] = useState('preset');
  const [uploadError, setUploadError] = useState(null);

  // Rich pictured character avatars (manga, cyberpunk, modern portraits)
  const profilePics = [
    '/avatars/avatar-1.svg',
    '/avatars/avatar-2.svg',
    '/avatars/avatar-3.svg',
    '/avatars/avatar-4.svg',
    '/avatars/avatar-5.svg',
    '/avatars/avatar-6.svg',
    '/avatars/avatar-7.svg',
    '/avatars/avatar-8.svg',
    '/avatars/avatar-9.svg',
    '/avatars/avatar-10.svg',
    '/avatars/avatar-11.svg',
    '/avatars/avatar-12.svg'
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const dataUrl = await processUserAvatar(file);
      setAvatar(dataUrl);
    } catch (err) {
      setUploadError(err.message || 'Failed to process image');
    }
  };

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
    // Update local profile name and avatar
    try {
      const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
      const updated = profiles.map(p => p.id === profileId ? { ...p, name: formData.displayName, avatar: avatar || p.avatar } : p);
      localStorage.setItem("profiles", JSON.stringify(updated));
      if (localStorage.getItem('selectedProfile') === profileId) {
        localStorage.setItem("selectedProfileName", formData.displayName);
      }
    } catch {
      // ignore
    }
    alert('Parameters saved successfully.');
    navigate('/profile');
  };

  return (
    <div className="pm-settings-wrapper">
      <Navbar />

      <main className="settings-container">
        {/* Navigation & Header */}
        <div className="settings-header">
          <button className="back-button font-mono" onClick={() => navigate('/profile')}>
            <FiArrowLeft />
            <span>[ RETURN TO PROFILES ]</span>
          </button>
          
          <div className="settings-title-group">
            <span className="mono-tag font-mono">// PARAMETER SPECIFICATIONS</span>
            <h1 className="settings-title">
              Operator Settings: <span className="settings-title-highlight">{profileData?.name || 'Reader'}</span>
            </h1>
            <p className="settings-subtitle">
              Tune recommendation hyperparameters, reading taxonomy filters, and connected session nodes.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="settings-tabs font-mono">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FiSliders size={13} />
            <span>01 // PROFILE</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'engine' ? 'active' : ''}`}
            onClick={() => setActiveTab('engine')}
          >
            <FiCpu size={13} />
            <span>02 // ALGORITHM</span>
          </button>
          <button
            className={`settings-tab ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            <FiMonitor size={13} />
            <span>03 // SESSIONS</span>
          </button>
        </div>

        {/* Tab 1: Profile Parameters */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-card">
              <div className="settings-card-header">
                <span className="mono-tag font-mono">CORE IDENTITY</span>
                <h2>Identity & Taxonomy Preferences</h2>
              </div>

              <div className="form-group">
                <label className="font-mono field-label">OPERATOR DISPLAY IDENTIFIER</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="form-control font-mono"
                  maxLength="20"
                  required
                />
              </div>

              {/* Avatar Configuration */}
              <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label className="font-mono field-label">OPERATOR AVATAR SELECTION</label>
                
                {avatar && (
                  <div className="avatar-live-preview">
                    <div className="avatar-preview-img-wrap">
                      <img src={avatar} alt="Current Avatar" />
                    </div>
                    <div className="avatar-preview-info">
                      <span className="avatar-preview-title font-mono">ACTIVE PROFILE AVATAR</span>
                      <span className="avatar-preview-sub font-mono">
                        {profilePics.includes(avatar) ? '● PRESET SYSTEM AVATAR' : '● CUSTOM UPLOADED PHOTO'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="avatar-source-tabs">
                  <button
                    type="button"
                    className={`avatar-tab-btn ${avatarTab === 'preset' ? 'active' : ''}`}
                    onClick={() => setAvatarTab('preset')}
                  >
                    <FiImage />
                    <span>PRESET AVATARS</span>
                  </button>
                  <button
                    type="button"
                    className={`avatar-tab-btn ${avatarTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setAvatarTab('upload')}
                  >
                    <FiUploadCloud />
                    <span>UPLOAD PHOTO</span>
                  </button>
                </div>

                {avatarTab === 'preset' ? (
                  <div className="avatar-grid" style={{ marginTop: '0.75rem' }}>
                    {profilePics.map((pic, index) => (
                      <div
                        key={index}
                        className={`avatar-option-wrap ${avatar === pic ? 'selected' : ''}`}
                        onClick={() => setAvatar(pic)}
                      >
                        <img src={pic} alt={`Preset ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="avatar-upload-section" style={{ marginTop: '0.75rem' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <div
                      className="avatar-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="avatar-dropzone-icon">
                        <FiUploadCloud />
                      </div>
                      <div className="avatar-dropzone-text font-mono">
                        CLICK TO BROWSE IMAGE
                      </div>
                      <div className="avatar-dropzone-sub font-mono">
                        PNG, JPG, WEBP, SVG · AUTOMATICALLY SCALED
                      </div>
                    </div>
                    {uploadError && (
                      <div className="username-error font-mono">{uploadError}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="font-mono field-label">CATALOG LANGUAGE</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="form-control font-mono"
                  >
                    <option value="English">English (Default)</option>
                    <option value="Japanese">Japanese (Original Manga)</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="font-mono field-label">CONTENT CLASSIFICATION</label>
                  <select
                    name="maturityRating"
                    value={formData.maturityRating}
                    onChange={handleInputChange}
                    className="form-control font-mono"
                  >
                    <option value="All Ages">All Ages (General Audience)</option>
                    <option value="Teen 13+">Teen 13+ (Shonen / YA)</option>
                    <option value="Mature 17+">Mature 17+ (Seinen / Unrestricted)</option>
                  </select>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dynamicDiscovery"
                    checked={formData.dynamicDiscovery}
                    onChange={handleInputChange}
                  />
                  <span>Enable dynamic carousel updates based on live reading interaction</span>
                </label>
              </div>

              <div className="avatar-preview-section">
                <label className="font-mono field-label">CURRENT AVATAR</label>
                <div className="avatar-preview-wrap">
                  <img src={profileData?.avatar} alt="Current" className="current-avatar" />
                  <div className="avatar-info font-mono">
                    <span className="avatar-spec">STATUS: VERIFIED AVATAR</span>
                    <span className="avatar-note">To update avatar, use the Manage Operator menu.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions font-mono">
              <button
                type="button"
                className="btn-editorial"
                onClick={() => navigate('/profile')}
              >
                [ CANCEL ]
              </button>
              <button type="submit" className="btn-editorial btn-editorial-primary">
                <span>[ COMMIT CHANGES ]</span>
                <FiCheck size={12} />
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Algorithm Parameters */}
        {activeTab === 'engine' && (
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="mono-tag font-mono">HYBRID HYPERPARAMETERS</span>
              <h2>Recommendation Model Calibration</h2>
            </div>

            <div className="form-group">
              <label className="font-mono field-label">SCORING ARCHITECTURE</label>
              <div className="radio-group font-mono">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="recommendationMode"
                    value="hybrid"
                    checked={formData.recommendationMode === 'hybrid'}
                    onChange={handleInputChange}
                  />
                  <span>HYBRID (TF-IDF + LightFM WARP Loss) — Recommended</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="recommendationMode"
                    value="content"
                    checked={formData.recommendationMode === 'content'}
                    onChange={handleInputChange}
                  />
                  <span>PURE SEMANTIC (TF-IDF Cosine Similarity)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="recommendationMode"
                    value="collaborative"
                    checked={formData.recommendationMode === 'collaborative'}
                    onChange={handleInputChange}
                  />
                  <span>COLLABORATIVE MATRIX (Latent Factorization)</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="slider-label-row font-mono">
                <label className="field-label">EXPLORATION VS EXPLOITATION RATIO</label>
                <span className="slider-val">{formData.explorationWeight}% EXPLOITATION</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                name="explorationWeight"
                value={formData.explorationWeight}
                onChange={handleInputChange}
                className="form-range"
              />
              <p className="field-hint">
                Controls the balance between known preferences (high exploitation) and serendipitous genre discovery (high exploration).
              </p>
            </div>

            <div className="telemetry-box font-mono">
              <div className="telemetry-box-title">// ACTIVE EVALUATION TELEMETRY</div>
              <div className="telemetry-grid">
                <div><span>MODEL ID:</span> <strong>cs22/book-engine</strong></div>
                <div><span>WARP PRECISION@5:</span> <strong>0.1688</strong></div>
                <div><span>DATASET:</span> <strong>Amazon Books 3M+</strong></div>
                <div><span>EMBEDDING DIM:</span> <strong>64 Latent</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Connected Sessions */}
        {activeTab === 'devices' && (
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="mono-tag font-mono">ACTIVE TELEMETRY</span>
              <h2>Connected Operator Workstations</h2>
            </div>
            <p className="field-hint" style={{ marginBottom: '1.5rem' }}>
              These workstations hold active access tokens and reading pipeline state for this operator.
            </p>

            <div className="devices-list">
              {devices.map((device) => (
                <div key={device.id} className="device-item">
                  <div className="device-info">
                    <div className="device-icon">{device.type}</div>
                    <div>
                      <h3 className="device-name font-mono">{device.name}</h3>
                      <p className="device-meta font-mono">
                        <span>{device.location}</span> &bull; <span>{device.lastActive}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSignOutDevice(device.id)}
                    className="btn-editorial btn-editorial-sm font-mono"
                  >
                    [ TERMINATE ]
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
