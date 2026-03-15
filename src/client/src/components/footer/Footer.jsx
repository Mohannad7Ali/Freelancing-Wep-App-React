import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* TOP LINKS */}
        <div className="top">
          <div className="item">
            <h2>التصنيفات</h2>
            <span>التصميم والرسومات</span>
            <span>البرمجة والتقنية</span>
            <span>التسويق الرقمي</span>
            <span>الفيديو والأنيميشن</span>
          </div>
          <div className="item">
            <h2>الدعم</h2>
            <span>المساعدة والدعم</span>
            <span>الثقة والأمان</span>
            <span>البيع على Syverr</span>
          </div>
          <div className="item">
            <h2>الشركة</h2>
            <span>من نحن</span>
            <span>سياسة الخصوصية</span>
            <span>شروط الخدمة</span>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="separator"></div>

        {/* BOTTOM */}
        <div className="bottom">
          <div className="copyright">
            © Syverr International Ltd. {new Date().getFullYear()}
          </div>
          <div className="social">
            <img src="/img/twitter.png" alt="Twitter" />
            <img src="/img/facebook.png" alt="Facebook" />
            <img src="/img/instagram.png" alt="Instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
