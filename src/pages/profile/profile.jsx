// src/pages/UserProfile/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import axios from "axios";
import "./profile.scss";
import newRequest from "../../utils/newRequest";

const UserProfile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());

  },[]);
  const handleDelete = async () => {
    try {
      await newRequest.delete(`/users/deleteUser`, { userId:user.id});
      localStorage.removeItem("currentUser");
      navigate("/"); // بعد الحذف يرجع للهوم
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="userProfile">
      <div className="profileCard">
        <img
          src={user.img || "/default-avatar.png"}
          alt={user.username}
          className="avatar"
        />
        <h2>{user.username}</h2>
        <p>Email: {user.email}</p>
        <p>Country: {user.country}</p>

        <div className="actions">
          <Link to={`/editprofile`} className="btn edit">
            Edit Profile
          </Link>
          <button onClick={handleDelete} className="btn delete">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
