import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userUID = localStorage.getItem("userUID");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userUID) return;

      const userRef = doc(db, "users", userUID);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userUID]);

  if (loading) {
    return <div className="profile-page"><h2>Loading profile...</h2></div>;
  }

  if (!userData) {
    return <div className="profile-page"><h2>User data not found.</h2></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <img
          src="https://i.imgur.com/1XzF8Zy.png"
          alt="Profile Avatar"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p>{userEmail}</p>
          <p>Member Since: {userData.joinedAt?.toDate().toDateString()}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <h3>Books Read</h3>
          <p>25</p>
        </div>
        <div className="stat-box">
          <h3>Favorites</h3>
          <p>10</p>
        </div>
        <div className="stat-box">
          <h3>Reviews</h3>
          <p>5</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
