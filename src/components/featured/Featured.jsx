import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (input.trim() !== "") {
      navigate(`/gigs?search=${input}`);
    }
  };

  const popularSearches = [
    "تصميم مواقع", 
    "تطبيقات موبايل", 
    "تصميم شعارات", 
    "خدمات الذكاء الاصطناعي",
    "تسويق إلكتروني",
    "برمجة وتطوير"
  ];

  return (
    <div className="featured" dir="rtl">
      <div className="hero-background">
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="container">
        <div className="content">
          <div className="left">
            <div className="badge">
              <span>🌟 المنصة السورية الأولى للعمل الحر</span>
            </div>

            <h1>
              حوّل أفكارك إلى 
              <span className="highlight"> واقع ملموس  </span> 
              مع أفضل المواهب العربية
            </h1>

            <p className="subtitle">
              انضم إلى آلاف العملاء الذين وجدوا الحلول المثالية لمشاريعهم عبر منصتنا. 
              استعرض آلاف الخدمات المميزة من مستقلين محترفين.
            </p>

            <div className="search-container">
              <div className="search-input-wrapper">
                <div className="search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder='ما الذي تبحث عنه؟ جرّب "تصميم موقع إلكتروني" أو "تطبيق جوال"'
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="search-input"
                />
                <button onClick={handleSubmit} className="search-btn">
                  ابحث الآن
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="popular-searches">
              <span className="label">عمليات البحث الشائعة:</span>
              <div className="tags">
                {popularSearches.map((search, index) => (
                  <button 
                    key={index} 
                    className="tag"
                    onClick={() => navigate(`/gigs?search=${search}`)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <span className="number">50,000+</span>
                <span className="label">خدمة مميزة</span>
              </div>
              <div className="stat">
                <span className="number">10,000+</span>
                <span className="label">مستقل محترف</span>
              </div>
              <div className="stat">
                <span className="number">98%</span>
                <span className="label">رضى العملاء</span>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="hero-image">
              <div className="floating-card card-1">
                <div className="card-content">
                  <span className="emoji">🎨</span>
                  <span>تصميم جرافيك</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-content">
                  <span className="emoji">💻</span>
                  <span>تطوير ويب</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-content">
                  <span className="emoji">📱</span>
                  <span>تطبيقات جوال</span>
                </div>
              </div>
              <div className="main-image">
                <img src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="مستقلين عرب" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featured;