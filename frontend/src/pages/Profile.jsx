import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiX, FiEdit2, FiCheck, FiTrash2 } from 'react-icons/fi';
import "../styles/ProfileSelection.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [selectedPic, setSelectedPic] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const profilePics = [
    'https://pngfre.com/wp-content/uploads/1000112715-768x872.png',
    'https://pngfre.com/wp-content/uploads/anime-162-1.png',
    'https://pngfre.com/wp-content/uploads/anime-272.png',
    'https://pngfre.com/wp-content/uploads/anime-33.png',
    'https://pngfre.com/wp-content/uploads/anime-282.png',
    'https://pngfre.com/wp-content/uploads/anime-268.png',
    'https://pngfre.com/wp-content/uploads/anime-267.png',
    'https://pngfre.com/wp-content/uploads/anime-267.png',
    'https://pngfre.com/wp-content/uploads/anime-33-759x1024.png'
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(stored);
  }, []);

  const saveProfilesToStorage = (updated) => {
    setProfiles(updated);
    localStorage.setItem("profiles", JSON.stringify(updated));
  };

  const handleProfileSelect = (profileId) => {
    if (!isManaging) {
      localStorage.setItem('selectedProfile', profileId);
      window.location.href = '/home';
    }
  };

  const handleAddProfile = async () => {
    if (newProfileName.trim() && selectedPic) {
      const res = await fetch("http://localhost:5000/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newProfileName })
      });
      const data = await res.json();
      if (data.exists) {
        setUsernameError("Username already taken. Try another one.");
        return;
      }

      const newProfile = {
        id: `user-${Date.now()}`,
        name: newProfileName,
        avatar: selectedPic,
        settings: {
          language: 'English',
          autoplay: true,
          maturityRating: 'PG-13'
        }
      };

      await fetch("http://localhost:5000/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newProfile.name, avatar: newProfile.avatar })
      });

      const updated = [...profiles, newProfile];
      saveProfilesToStorage(updated);
      setNewProfileName('');
      setSelectedPic(null);
      setIsEditing(false);
      setUsernameError(null);
    }
  };

  const handleDeleteProfile = (profileId) => {
    const updated = profiles.filter(profile => profile.id !== profileId);
    saveProfilesToStorage(updated);
  };

  const startEditingName = (profile) => {
    setEditingProfileId(profile.id);
    setEditedName(profile.name);
    setUsernameError("");
  };

  const saveEditedName = async (profile) => {
    try {
      const res = await fetch("http://localhost:5000/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newProfileName })
      });

      const data = await res.json();
      if (data.exists) {
        setUsernameError("Username already taken. Try another one.");
        return;
      }

      const updatedProfiles = profiles.map((p) =>
        p.id === profile.id ? { ...p, name: editedName } : p
      );

      await fetch("http://localhost:5000/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: editedName, avatar: profile.avatar })
      });

      saveProfilesToStorage(updatedProfiles);
      setEditingProfileId(null);
      setEditedName("");
      setUsernameError(null);
      localStorage.setItem("selectedProfileName", editedName);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("Something went wrong. Please try again.");
    }
  };

  const handleSettingsClick = (profileId, e) => {
    e.stopPropagation();
    const profileData = profiles.find(p => p.id === profileId);
    navigate(`/settings/${profileId}`, {
      state: { profileId, profileData }
    });
  };

  return (
    <div className="profile-selection-container">
      <h1>Who's using Page Break?</h1>

      <div className="profiles-grid">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className="profile-card"
            onClick={() => !isManaging && handleProfileSelect(profile.id)}
          >
            {isManaging && (
              <button
                className="delete-profile-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProfile(profile.id);
                }}
              >
                <FiTrash2 />
              </button>
            )}

            <div className="profile-image-container">
              <img src={profile.avatar} alt={profile.name} />
              {!isManaging && (
                <button
                  className="settings-btn"
                  onClick={(e) => handleSettingsClick(profile.id, e)}
                >
                  <FiSettings />
                </button>
              )}
            </div>

            {editingProfileId === profile.id ? (
              <div className="name-edit-container">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  maxLength="20"
                  autoFocus
                />
                <button
                  className="save-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveEditedName(profile);
                  }}
                >
                  <FiCheck />
                </button>
              </div>
            ) : (
              <div className="profile-name-container">
                <span>{profile.name}</span>
                {isManaging && (
                  <button
                    className="edit-name-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingName(profile);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                )}
              </div>
            )}

            {usernameError && editingProfileId === profile.id && (
              <div className="username-error">{usernameError}</div>
            )}
          </div>
        ))}

        {profiles.length < 5 && (
          <div className="profile-card add-profile" onClick={() => setIsEditing(true)}>
            <div className="add-icon">+</div>
            <span>Add Profile</span>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="profile-editor">
          <div className="editor-header">
            <h2>Create Profile</h2>
            <button className="close-editor-btn" onClick={() => setIsEditing(false)}>
              <FiX />
            </button>
          </div>

          <div className="avatar-selection">
            <h3>Choose an avatar:</h3>
            <div className="avatar-grid">
              {profilePics.map((pic, index) => (
                <img
                  key={index}
                  src={pic}
                  alt={`Avatar ${index + 1}`}
                  className={selectedPic === pic ? 'selected' : ''}
                  onClick={() => setSelectedPic(pic)}
                />
              ))}
            </div>
          </div>

          <div className="name-input">
            <input
              type="text"
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              maxLength="20"
            />
          </div>

          {usernameError && <div className="username-error">{usernameError}</div>}

          <div className="editor-buttons">
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={handleAddProfile}
              disabled={!newProfileName.trim() || !selectedPic}
            >
              Create Profile
            </button>
          </div>
        </div>
      )}

      <button className="manage-profiles-btn" onClick={() => setIsManaging(!isManaging)}>
        {isManaging ? 'Done' : 'Manage Profiles'}
      </button>
    </div>
  );
};

export default Profile;
