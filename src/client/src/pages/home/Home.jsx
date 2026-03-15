import React, { useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { cards, projects } from "../../data";

function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
const handleCategoryClick = (category) => {
  navigate(`/gigs?cat=${category}`);
};
  return (
    <div className="home" dir="rtl">
      <Featured />
        {/* FEATURES (عنوان مركزي، عناصر باليمين) */}
      <section className="features">
        <div className="container">
          <div className="content">
            <h1 className="main-title">عالم كامل من المواهب الحرة بين يديك</h1>

            <ul className="feature-list">
              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>الأفضل لكل ميزانية</span>
                </div>
                <p className="desc">
                  اعثر على خدمات عالية الجودة بأسعار تناسب جميع الميزانيات، بدون أسعار بالساعة — فقط أسعار المشاريع.
                </p>
              </li>

              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>جودة العمل بسرعة</span>
                </div>
                <p className="desc">اعثر على المستقل المناسب وابدأ مشروعك خلال دقائق.</p>
              </li>

              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>مدفوعات آمنة</span>
                </div>
                <p className="desc">تعرف دائمًا على المبلغ الذي ستدفعه، الدفع يُفرج عنه بعد موافقتك على العمل.</p>
              </li>

              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>دعم 24/7</span>
                </div>
                <p className="desc">خدمة دعم مستمرة لضمان تجربة سلسة واحترافية.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

        {/* EXPLORE */}
       <section className="explore">
        <div className="container">
          <h2 className="explore-title">استكشف السوق</h2>

          <div className="items">
            <div className="item" onClick={() => handleCategoryClick("Graphics & Design")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg" alt="تصميم" />
              <div className="line" />
              <span>تصميم ورسومات</span>
            </div>

            <div className="item" onClick={() => handleCategoryClick("Digital Marketing")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg" alt="تسويق" />
              <div className="line" />
              <span>التسويق الرقمي</span>
            </div>

            <div className="item" onClick={() => handleCategoryClick("Writing & Translation")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg" alt="كتابة" />
              <div className="line" />
              <span>الكتابة والترجمة</span>
            </div>

            <div className="item" onClick={() => handleCategoryClick("Video & Animation")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/video-animation.f0d9d71.svg" alt="فيديو" />
              <div className="line" />
              <span>الفيديو والأنيميشن</span>
            </div>
            <div className="item" onClick={() => handleCategoryClick("Business")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg" alt="تسويق" />
              <div className="line" />
              <span>Business</span>
            </div>

            <div className="item" onClick={() => handleCategoryClick("Music & Audio")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg" alt="موسيقى" />
              <div className="line" />
              <span>الموسيقى والصوت</span>
            </div>

            <div className="item" onClick={() => handleCategoryClick("Programming & Tech")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg" alt="برمجة" />
              <div className="line" />
              <span>البرمجة والتقنية</span>
            </div>
            <div className="item" onClick={() => handleCategoryClick("AI Services")}>
              <img src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg" alt="برمجة" />
              <div className="line" />
              <span> خدمات الذكاء الاصطناعي</span>
            </div>
          </div>
        </div>
      </section>
      <section className="cards-row">
        <Slide slidesToShow={5} arrowsScroll={5}>
          {cards.map((card) => (
            <CatCard key={card.id} card={card} />
          ))}
        </Slide>
      </section>

    
      {/* DARK FEATURES */}
      <section className="features dark">
        <div className="container">
          <div className="content">
            <h2 className="dark-title">منصة <i>أعمال</i></h2>
            <p className="dark-sub">حل أعمال مصمم للفرق — تجربة منظمة مليئة بالأدوات والفوائد.</p>

            <ul className="feature-list">
              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>تواصل مع محترفين لديهم خبرة مثبتة</span>
                </div>
              </li>
              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>احصل على أفضل المواهب بواسطة مدير نجاح العملاء</span>
                </div>
              </li>
              <li>
                <div className="title">
                  <img src="./img/check.png" alt="check" />
                  <span>إدارة الفريق وزيادة الإنتاجية بمكان عمل واحد قوي</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECT CARDS */}
      <section className="projects-row">
        <Slide slidesToShow={4} arrowsScroll={4}>
          {projects.map((card) => (
            <ProjectCard key={card.id} card={card} />
          ))}
        </Slide>
      </section>

    
    </div>
  );
}

export default Home;
