import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiX,
  FiEdit2,
  FiCheck,
  FiTrash2,
  FiPlus,
  FiUploadCloud,
  FiImage,
  FiCamera,
  FiUserCheck,
  FiArrowRight,
  FiCpu,
  FiUserPlus
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/ProfileSelection.css";
import API_BASE_URL from '../config';
import { processUserAvatar } from '../utils/imageHelper';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const [profiles, setProfiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editingAvatarProfile, setEditingAvatarProfile] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [selectedPic, setSelectedPic] = useState(null);
  const [avatarSourceTab, setAvatarSourceTab] = useState('preset'); // 'preset' | 'upload'
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

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

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("profiles")) || [];

    // Sanitize any legacy Unsplash or line-art avatars from stored profiles
    let needsResave = false;
    stored = stored.map((p, idx) => {
      const isLegacyUnsplash = typeof p.avatar === 'string' && p.avatar.includes('unsplash.com');
      const isLegacyLineArt = typeof p.avatar === 'string' && (p.avatar.includes('// ARCH') || p.avatar.includes('data:image/svg+xml'));
      if (isLegacyUnsplash || isLegacyLineArt) {
        needsResave = true;
        return { ...p, avatar: profilePics[idx % profilePics.length] };
      }
      return p;
    });

    if (stored.length === 0) {
      const initialProfile = {
        id: 'user-default',
        name: localStorage.getItem('selectedProfileName') || 'Reader',
        avatar: profilePics[0],
        settings: {
          language: 'English',
          autoplay: true,
          maturityRating: 'PG-13'
        }
      };
      stored = [initialProfile];
      needsResave = true;
    }

    if (needsResave) {
      localStorage.setItem("profiles", JSON.stringify(stored));
    }

    setProfiles(stored);
    setSelectedPic(profilePics[0]);
  }, []);

  const saveProfilesToStorage = (updated) => {
    setProfiles(updated);
    localStorage.setItem("profiles", JSON.stringify(updated));
  };

  const handleProfileSelect = (profile) => {
    if (!isManaging) {
      localStorage.setItem('selectedProfile', profile.id);
      localStorage.setItem('selectedProfileName', profile.name);
      navigate('/home');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    setUploadError(null);
    try {
      const dataUrl = await processUserAvatar(file);
      setSelectedPic(dataUrl);
    } catch (err) {
      setUploadError(err.message || 'Failed to process image');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const openNewProfileModal = (tab = 'preset') => {
    setEditingAvatarProfile(null);
    setNewProfileName('');
    setSelectedPic(profilePics[0]);
    setAvatarSourceTab(tab);
    setUploadError(null);
    setUsernameError(null);
    setIsEditing(true);
    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 60);
  };

  const openEditUsernameModal = (profile, e) => {
    if (e) e.stopPropagation();
    setEditingAvatarProfile(profile);
    setNewProfileName(profile.name || '');
    setSelectedPic(profile.avatar);
    setAvatarSourceTab('preset');
    setUploadError(null);
    setUsernameError(null);
    setIsEditing(true);
    setTimeout(() => {
      usernameInputRef.current?.focus();
      usernameInputRef.current?.select();
    }, 60);
  };

  const openChangeAvatarModal = (profile, tab = 'upload', e) => {
    if (e) e.stopPropagation();
    setEditingAvatarProfile(profile);
    setNewProfileName(profile.name || '');
    setSelectedPic(profile.avatar);
    setAvatarSourceTab(tab);
    setUploadError(null);
    setUsernameError(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!selectedPic) return;

    // Case 1: Editing existing profile's avatar & username
    if (editingAvatarProfile) {
      const finalName = newProfileName.trim() || editingAvatarProfile.name;
      const updated = profiles.map(p =>
        p.id === editingAvatarProfile.id ? { ...p, name: finalName, avatar: selectedPic } : p
      );
      saveProfilesToStorage(updated);
      if (localStorage.getItem('selectedProfile') === editingAvatarProfile.id) {
        localStorage.setItem("selectedProfileName", finalName);
      }
      try {
        await fetch(`${API_BASE_URL}/update-username`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ old_username: editingAvatarProfile.name, new_username: finalName })
        });
      } catch {
        // Local persistence continues
      }
      setIsEditing(false);
      setEditingAvatarProfile(null);
      return;
    }

    // Case 2: Creating a brand new profile
    if (!newProfileName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/check-username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newProfileName })
      });
      const data = await res.json();
      if (data.exists) {
        setUsernameError("Username already taken. Try another name.");
        return;
      }
    } catch {
      // Offline / fallback
    }

    const newProfile = {
      id: `user-${Date.now()}`,
      name: newProfileName.trim(),
      avatar: selectedPic,
      settings: {
        language: 'English',
        autoplay: true,
        maturityRating: 'PG-13'
      }
    };

    try {
      await fetch(`${API_BASE_URL}/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newProfile.name, avatar: newProfile.avatar })
      });
    } catch {
      // Local storage persists
    }

    const updated = [...profiles, newProfile];
    saveProfilesToStorage(updated);
    setNewProfileName('');
    setSelectedPic(profilePics[0]);
    setIsEditing(false);
    setUsernameError(null);
  };

  const handleDeleteProfile = (profileId) => {
    if (profiles.length <= 1) {
      alert("At least one operator profile must be maintained in the directory.");
      return;
    }
    const updated = profiles.filter(p => p.id !== profileId);
    saveProfilesToStorage(updated);
    if (localStorage.getItem('selectedProfile') === profileId) {
      localStorage.setItem('selectedProfile', updated[0].id);
      localStorage.setItem('selectedProfileName', updated[0].name);
    }
  };

  const startEditingName = (profile) => {
    setEditingProfileId(profile.id);
    setEditedName(profile.name);
    setUsernameError("");
  };

  const saveEditedName = async (profile) => {
    if (!editedName.trim()) return;

    const updatedProfiles = profiles.map((p) =>
      p.id === profile.id ? { ...p, name: editedName.trim() } : p
    );

    saveProfilesToStorage(updatedProfiles);
    setEditingProfileId(null);
    if (localStorage.getItem('selectedProfile') === profile.id) {
      localStorage.setItem("selectedProfileName", editedName.trim());
    }
  };

  const handleSettingsClick = (profileId, e) => {
    if (e) e.stopPropagation();
    const profileData = profiles.find(p => p.id === profileId);
    navigate(`/settings/${profileId}`, {
      state: { profileId, profileData }
    });
  };

  const isCustomUpload = selectedPic && !profilePics.includes(selectedPic);
  const activeProfileId = localStorage.getItem('selectedProfile');

  return (
    <div className="pm-profile-page-wrapper">
      <Navbar />

      <main className="profile-selection-container">
        {/* Architectural Hero Header Group */}
        <div className="profile-header-group">
          <div className="profile-header-eyebrow">
            <span className="status-dot"></span>
            <span>OPERATOR DIRECTORY // AUTH-SESSION</span>
          </div>

          <h1>Select Operator Profile</h1>
          
          <p>
            Personalized recommendation vectors, reading velocity, and latent preferences are isolated per operator profile.
          </p>

          <div className="profile-telemetry-bar font-mono">
            <span className="profile-telemetry-item">
              NODE: <span className="profile-telemetry-val">LOCAL-01</span>
            </span>
            <span className="profile-telemetry-sep">/</span>
            <span className="profile-telemetry-item">
              ENGINE: <span className="profile-telemetry-val">CS22/BOOK-ENGINE</span>
            </span>
            <span className="profile-telemetry-sep">/</span>
            <span className="profile-telemetry-item">
              CATALOG: <span className="profile-telemetry-val">6,511 VECTORS</span>
            </span>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="profiles-grid">
          {profiles.map((profile, idx) => {
            const isActive = profile.id === activeProfileId;
            const opTag = `OP_0${idx + 1}`;
            const roleTag = idx === 0 ? "LEAD RESEARCHER" : "CATALOG OPERATOR";

            return (
              <div
                key={profile.id}
                className={`profile-card ${isActive ? 'profile-card--active' : ''}`}
                onClick={() => !isManaging && handleProfileSelect(profile)}
              >
                {/* Card Top Bar */}
                <div className="profile-card-top-bar font-mono">
                  <span className="op-tag">[{opTag}]</span>
                  <span className={`profile-status-pill ${isActive ? 'profile-status-pill--active' : 'profile-status-pill--standby'}`}>
                    {isActive ? '● ACTIVE OPERATOR' : '○ STANDBY'}
                  </span>
                </div>

                {/* Middle Avatar & Info Row */}
                <div className="profile-middle-section">
                  <div 
                    className="profile-image-container"
                    title="Click to upload custom photo or pick avatar"
                    onClick={(e) => openChangeAvatarModal(profile, 'upload', e)}
                  >
                    <img src={profile.avatar} alt={profile.name} />
                    <div className="profile-image-hover-overlay font-mono">
                      <FiUploadCloud size={16} />
                      <span>CHANGE</span>
                    </div>
                  </div>

                  <div className="profile-info-col">
                    {editingProfileId === profile.id ? (
                      <div className="name-edit-container font-mono" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          maxLength="20"
                          autoFocus
                        />
                        <button
                          className="save-edit-btn"
                          title="Save Username"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEditedName(profile);
                          }}
                        >
                          <FiCheck size={13} />
                        </button>
                      </div>
                    ) : (
                      <div className="profile-name-row">
                        <h2 className="profile-display-name">{profile.name}</h2>
                        <button
                          className="edit-name-btn"
                          title="Rename operator inline"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingName(profile);
                          }}
                        >
                          <FiEdit2 size={10} />
                          <span>RENAME</span>
                        </button>
                      </div>
                    )}

                    <span className="profile-role-tag font-mono">// {roleTag}</span>

                    {/* Compact, clean action pills */}
                    <div className="profile-card-pills-row">
                      <button
                        className="profile-card-pill font-mono"
                        title="Edit operator username"
                        onClick={(e) => openEditUsernameModal(profile, e)}
                      >
                        <FiEdit2 size={10} />
                        <span>USERNAME</span>
                      </button>

                      <button
                        className="profile-card-pill font-mono"
                        title="Upload photo or choose avatar"
                        onClick={(e) => openChangeAvatarModal(profile, 'upload', e)}
                      >
                        <FiUploadCloud size={11} />
                        <span>PHOTO / AVATAR</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Technical Telemetry Mini Grid */}
                <div className="profile-specs-grid">
                  <div className="profile-spec-item">
                    <span className="profile-spec-label">PARTITION</span>
                    <span className="profile-spec-val">DEDICATED</span>
                  </div>
                  <div className="profile-spec-item">
                    <span className="profile-spec-label">ALGORITHM</span>
                    <span className="profile-spec-val">HYBRID TF-IDF</span>
                  </div>
                </div>

                {/* Single Primary Card Action Footer */}
                <div className="profile-card-actions">
                  {isManaging ? (
                    <button
                      className="delete-profile-btn font-mono"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfile(profile.id);
                      }}
                    >
                      <FiTrash2 size={12} />
                      <span>TERMINATE OPERATOR</span>
                    </button>
                  ) : isActive ? (
                    <button
                      className="profile-action-btn profile-action-btn--active-cta font-mono"
                      onClick={() => navigate('/home')}
                    >
                      <span>ENTER DISCOVERY ARCHIVE</span>
                      <FiArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      className="profile-action-btn profile-action-btn--resume font-mono"
                      onClick={() => handleProfileSelect(profile)}
                    >
                      <span>SWITCH TO OPERATOR</span>
                      <FiArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Operator Card */}
          {profiles.length < 5 && (
            <div className="profile-card add-profile" onClick={() => openNewProfileModal('preset')}>
              <div className="add-container">
                <FiPlus className="add-icon" />
              </div>
              <div className="add-title font-mono">+ INITIALIZE OPERATOR</div>
              <p className="add-desc">
                Provision an isolated recommendation space with dedicated avatar &amp; preference weights.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Control Toolbar */}
        <div className="profile-actions-bar">
          <button
            className="btn-editorial btn-editorial-primary font-mono"
            onClick={() => openNewProfileModal('preset')}
          >
            <FiUserPlus size={13} />
            <span>[ + ADD USERNAME / OPERATOR ]</span>
          </button>

          <button
            className="btn-editorial font-mono"
            onClick={() => openNewProfileModal('upload')}
          >
            <FiUploadCloud size={13} />
            <span>[ + UPLOAD PHOTO PROFILE ]</span>
          </button>

          <button
            className={`btn-editorial font-mono ${isManaging ? 'btn-editorial-primary' : ''}`}
            onClick={() => setIsManaging(!isManaging)}
          >
            <span>{isManaging ? '[ FINISH MANAGEMENT ]' : '[ MANAGE DIRECTORY ]'}</span>
          </button>
          
          <button
            className="btn-editorial font-mono"
            onClick={() => navigate('/settings/' + (activeProfileId || 'user-default'))}
          >
            <FiSettings size={12} />
            <span>[ OPERATOR SETTINGS ]</span>
          </button>
        </div>

        {/* Profile Editor Modal (New Profile or Change Avatar) */}
        {isEditing && (
          <div className="profile-editor-overlay" onClick={() => setIsEditing(false)}>
            <div className="profile-editor" onClick={(e) => e.stopPropagation()}>
              <div className="editor-header">
                <div>
                  <span className="mono-tag font-mono">
                    {editingAvatarProfile ? `// OPERATOR: ${editingAvatarProfile.name}` : '// REGISTER OPERATOR'}
                  </span>
                  <h2>{editingAvatarProfile ? 'Edit Operator Username & Avatar' : 'Add New Operator Username'}</h2>
                </div>
                <button className="close-editor-btn" onClick={() => setIsEditing(false)}>
                  <FiX />
                </button>
              </div>

              {/* OPERATOR USERNAME INPUT: Prominently Positioned at Top */}
              <div className="name-input" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label className="font-mono field-label" style={{ marginBottom: 0, color: 'var(--text-primary)', fontWeight: 600 }}>
                    OPERATOR USERNAME {editingAvatarProfile ? '(RENAME OPERATOR)' : '(REQUIRED)'}
                  </label>
                  <span className="font-mono" style={{ fontSize: '10px', color: 'var(--accent)' }}>
                    // USER IDENTIFIER
                  </span>
                </div>
                <input
                  ref={usernameInputRef}
                  type="text"
                  placeholder="Enter operator username (e.g. Saketh)..."
                  value={newProfileName}
                  onChange={(e) => {
                    setNewProfileName(e.target.value);
                    if (usernameError) setUsernameError(null);
                  }}
                  maxLength="20"
                  className="font-mono"
                  style={{
                    backgroundColor: '#161614',
                    border: '1px solid var(--border-strong)',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  required
                />
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  Your username personalizes your discovery feeds, reading vault, and model embeddings.
                </span>
                {usernameError && <div className="username-error font-mono">{usernameError}</div>}
              </div>

              {/* Live Preview of Current Choice */}
              {selectedPic && (
                <div className="avatar-live-preview">
                  <div className="avatar-preview-img-wrap">
                    <img src={selectedPic} alt="Current Preview" />
                  </div>
                  <div className="avatar-preview-info">
                    <span className="avatar-preview-title font-mono">SELECTED AVATAR VIEWPORT</span>
                    <span className="avatar-preview-sub font-mono">
                      {isCustomUpload ? '● CUSTOM UPLOADED PHOTO' : '● PRESET SYSTEM AVATAR'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab Selector: Preset Avatars vs Upload Custom Image */}
              <div className="avatar-source-tabs">
                <button
                  type="button"
                  className={`avatar-tab-btn ${avatarSourceTab === 'preset' ? 'active' : ''}`}
                  onClick={() => setAvatarSourceTab('preset')}
                >
                  <FiImage />
                  <span>PRESET AVATARS</span>
                </button>
                <button
                  type="button"
                  className={`avatar-tab-btn ${avatarSourceTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setAvatarSourceTab('upload')}
                >
                  <FiUploadCloud />
                  <span>UPLOAD PHOTO</span>
                </button>
              </div>

              {/* Mode 1: Preset System Avatars */}
              {avatarSourceTab === 'preset' && (
                <div className="avatar-selection">
                  <h3 className="font-mono">Choose System Avatar:</h3>
                  <div className="avatar-grid">
                    {profilePics.map((pic, index) => (
                      <div
                        key={index}
                        className={`avatar-option-wrap ${selectedPic === pic ? 'selected' : ''}`}
                        onClick={() => setSelectedPic(pic)}
                      >
                        <img src={pic} alt={`Avatar ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode 2: Upload Own Image */}
              {avatarSourceTab === 'upload' && (
                <div className="avatar-upload-section">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  <div
                    className={`avatar-dropzone ${isDragging ? 'dragging' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="avatar-dropzone-icon">
                      <FiUploadCloud />
                    </div>
                    <div className="avatar-dropzone-text font-mono">
                      CLICK OR DRAG PHOTO HERE
                    </div>
                    <div className="avatar-dropzone-sub font-mono">
                      PNG, JPG, WEBP, SVG · AUTOMATICALLY SCALED
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-editorial btn-editorial-primary font-mono"
                    style={{ width: '100%', justifyContent: 'center', marginBottom: '1.25rem', padding: '10px' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUploadCloud size={14} />
                    <span>[ BROWSE IMAGE FILE FROM COMPUTER ]</span>
                  </button>

                  {uploadError && (
                    <div className="username-error font-mono" style={{ marginBottom: '12px' }}>
                      {uploadError}
                    </div>
                  )}
                </div>
              )}

              <div className="editor-buttons font-mono">
                <button className="btn-editorial" onClick={() => setIsEditing(false)}>
                  [ CANCEL ]
                </button>
                <button
                  className="btn-editorial btn-editorial-primary font-mono"
                  onClick={handleSaveProfile}
                  disabled={!selectedPic || !newProfileName.trim()}
                >
                  {editingAvatarProfile ? '[ SAVE USERNAME & AVATAR ]' : '[ CREATE OPERATOR WITH USERNAME ]'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
