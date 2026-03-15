import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import upload from "../../utils/upload"; 
import "./EditProfile.scss";

const EditProfile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    country: "",
    img: "",
  });

  // List of countries for the dropdown
  const countries = [
    "United States","syria" , "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "Brazil", "India", "China", "South Africa", "Egypt",
    "Saudi Arabia", "United Arab Emirates", "Other"
  ];

  // جلب بيانات المستخدم القديم من localStorage
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        username: currentUser.username || "",
        email: currentUser.email || "",
        country: currentUser.country || "",
        img: currentUser.img || "",
      });
      setFileUrl(currentUser.img || null);
    }
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileUrl(""); // reset preview حتى يبان الجديد
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let url = fileUrl;
      if (!fileUrl && file) {
        url = await upload(file); // رفع الصورة الجديدة
        setFileUrl(url);
      }

      const currentUser = getCurrentUser();
      console.log(currentUser)
      await newRequest.put(`/users/${currentUser._id}`, {
        ...user,
        img: url,
      });

      // تحديث localStorage بعد التعديل
      const updatedUser = { ...currentUser, ...user, img: url };
        localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="editProfile">
      <form className="editForm" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />

        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={user.country}
          onChange={handleChange}
        >
          <option value="">Select your country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label htmlFor="profileImage">Profile Image</label>
        {fileUrl && (
          <div className="preview">
            <img src={fileUrl} alt="Profile Preview" className="preview-img" />
          </div>
        )}
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;