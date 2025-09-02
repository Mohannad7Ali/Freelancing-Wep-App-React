import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const userRef = useRef();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">SyLancer</span>
          </Link>
          <span className="dot">.</span>
        </div>
        
        <div className="links">
          {currentUser && (
            <>
              <span>
                <Link className="link" to="/projects">
                  تصفح المشاريع
                </Link>
                  </span>
                {/* <span>
                <Link className="link" to="/messages">
                  الرسائل
                </Link>
              </span> */}
              {/* <span>  
                <Link className="link" to="/orders">
                  الطلبات
                </Link>
              </span> */}
              <span>  
                <Link className="link" to="/gigs">
                  تصفح الخدمات
                </Link>
              </span>
            
            </>
          )}

          {currentUser && currentUser?.isSeller && (
            <>
              <span>
                <Link className="link" to="/mygigs">
                  خدماتي
                </Link>
              </span>
            
              <span>
                <Link className="link" to="/add">
                  إضافة خدمة جديدة
                </Link>
              </span>
            </>
          )}
          {currentUser && !currentUser?.isSeller && (
            <>
              <span>
                <Link className="link" to="/myProjects">
                  مشاريعي
                </Link>
              </span>
            
              <span>
                <Link className="link" to="/addProject">
                  إضافة مشروع 
                </Link>
              </span>
            </>
          )}

          {currentUser ? (
            <div ref={userRef} className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>

              {open && (
                <div className="options">
                  <Link className="link" to="/profile">الملف الشخصي</Link>
                  <Link className="link" to="/orders">طلباتي</Link>
                  <Link className="link" to="/messages">الرسائل</Link>
                  <span onClick={handleLogout} className="link">تسجيل الخروج</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">تسجيل الدخول</Link>
              <Link className="link" to="/register">
                <button>انضم الآن</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
