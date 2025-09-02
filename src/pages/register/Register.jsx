import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });

  const navigate = useNavigate();

  // List of countries for the dropdown
  const countries = [
    "United States","syria" , "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "Brazil", "India", "China", "South Africa", "Egypt",
    "Saudi Arabia", "United Arab Emirates", "Other"
  ];

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const validateForm = () => {
    if (!user.username || !user.email || !user.password || !confirmPassword) {
      setError("جميع الحقول المطلوبة يجب ملؤها");
      return false;
    }

    if (user.password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return false;
    }

    if (user.password.length < 6) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      return false;
    }

    if (user.isSeller && !user.phone) {
      setError("رقم الهاتف مطلوب لحسابات البائعين");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileUrl(""); // Reset file URL when new file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    try {
      let url = fileUrl;
      if (!fileUrl && file) {
        url = file ? await upload(file) : "";
        setFileUrl(url);
      }

      await newRequest.post("/auth/register", {
        ...user,
        img: url
      });
      const res = await newRequest.post("/auth/login", {
        username: user.username,
        password: user.password
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "حدث خطأ أثناء التسجيل");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Mohannad Ali"
            onChange={handleChange}
            value={user.username}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="test@gmail.com"
            onChange={handleChange}
            value={user.email}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              value={user.password}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="profileImage">Profile Picture</label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            onChange={handleChange}
            value={user.country}
            required
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              "Register"
            )}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="isSeller">Activate the seller account</label>
            <label className="switch">
              <input
                id="isSeller"
                type="checkbox"
                checked={user.isSeller}
                onChange={handleSeller}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {user.isSeller && (
            <>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 89"
                onChange={handleChange}
                value={user.phone}
              />

              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                placeholder="A short description of yourself"
                name="desc"
                cols="30"
                rows="10"
                onChange={handleChange}
                value={user.desc}
              ></textarea>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Register;