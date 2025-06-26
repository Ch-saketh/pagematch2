import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiX, FiEdit2, FiCheck, FiTrash2 } from 'react-icons/fi';
import "../styles/ProfileSelection.css";

const ProfileSelection = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [selectedPic, setSelectedPic] = useState(null);

  // Built-in profile pictures (10 options)
  const profilePics = [
    'https://pngfre.com/wp-content/uploads/1000112715-768x872.png',
    'https://pngfre.com/wp-content/uploads/anime-162-1.png',
    'https://pngfre.com/wp-content/uploads/anime-272.png',
    'https://pngfre.com/wp-content/uploads/anime-33.png',
    'https://pngfre.com/wp-content/uploads/anime-33.png',
    'https://pngfre.com/wp-content/uploads/anime-282.png',
    'https://pngfre.com/wp-content/uploads/anime-268.png',
    'https://pngfre.com/wp-content/uploads/anime-267.png',
    'https://pngfre.com/wp-content/uploads/anime-267.png',
    'https://pngfre.com/wp-content/uploads/anime-33-759x1024.png'
  ];

  // Load profiles from Neo4j (mock for now)
  const loadProfiles = async () => {
    try {
      // In a real app, you would fetch from your backend which connects to Neo4j
      const mockProfiles = [
        { id: '1', name: 'User 1', avatar: profilePics[0], settings: {} },
        { id: '2', name: 'User 2', avatar: profilePics[1], settings: {} }
      ];
      setProfiles(mockProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
  };

  // Initialize
  useEffect(() => {
    loadProfiles();
  }, []);

  const handleProfileSelect = (profileId) => {
    if (!isManaging) {
      navigate(`/dashboard/${profileId}`);
    }
  };

  const handleAddProfile = () => {
    if (newProfileName.trim() && selectedPic) {
      const newProfile = {
        id: `temp-${Date.now()}`,
        name: newProfileName,
        avatar: selectedPic,
        settings: {
          language: 'English',
          autoplay: true,
          maturityRating: 'PG-13'
        }
      };
      
      setProfiles([...profiles, newProfile]);
      setNewProfileName('');
      setSelectedPic(null);
      setIsEditing(false);
    }
  };

  const handleDeleteProfile = (profileId) => {
    setProfiles(profiles.filter(profile => profile.id !== profileId));
  };

  const startEditingName = (profile) => {
    setEditingProfileId(profile.id);
    setEditedName(profile.name);
  };

 const saveEditedName = () => {
  setProfiles(profiles.map(profile =>  // Changed from setProfiles to setProfiles
    profile.id === editingProfileId 
      ? { ...profile, name: editedName } 
      : profile
  ));
  setEditingProfileId(null);
};

  const handleSettingsClick = (profileId, e) => {
    e.stopPropagation();
    navigate(`/profile-settings/${profileId}`);
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
  {!isManaging && (  // Only show settings button when NOT in management mode
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
                    saveEditedName();
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
          </div>
        ))}
        
        {profiles.length < 5 && (
          <div 
            className="profile-card add-profile"
            onClick={() => setIsEditing(true)}
          >
            <div className="add-icon">+</div>
            <span>Add Profile</span>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="profile-editor">
          <div className="editor-header">
            <h2>Create Profile</h2>
            <button 
              className="close-editor-btn"
              onClick={() => setIsEditing(false)}
            >
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
          
          <div className="editor-buttons">
            <button 
              className="cancel-btn"
              onClick={() => setIsEditing(false)}
            >
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
      
      <button 
        className="manage-profiles-btn"
        onClick={() => setIsManaging(!isManaging)}
      >
        {isManaging ? 'Done' : 'Manage Profiles'}
      </button>
    </div>
  );
};

export default ProfileSelection;