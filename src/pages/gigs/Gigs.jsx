import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search, sort, selectedCategory],
    queryFn: () =>
      newRequest
        .get(
          `/gigs/allGigs${
            search ? search : "?"
          }&min=${minRef.current?.value || ""}&max=${
            maxRef.current?.value || ""
          }&sort=${sort}&cat=${selectedCategory !== "all" ? selectedCategory : ""}`
        )
        .then((res) => res.data),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, selectedCategory, refetch]);

  const apply = () => {
    refetch();
  };

  // تخصيص أسماء التصنيفات بالعربية
  const categoryNames = {
    "all": "جميع التصنيفات",
    "Graphics & Design": "التصميم والجرافيك",
    "Digital Marketing": "التسويق الرقمي",
    "Writing & Translation": "الكتابة والترجمة",
    "Video & Animation": "الفيديو والرسوم المتحركة",
    "Music & Audio": "الموسيقى والصوت",
    "Programming & Tech": "البرمجة والتقنية",
    "Business": "الأعمال",
    "Lifestyle": "نمط الحياة",
    "AI Services": "خدمات الذكاء الاصطناعي"
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">منصتي</span>
        <h1>الخدمات المتاحة</h1>
        <p>استكشف أحدث العروض في عالم التقنية والفن مع منصتي</p>

        <div className="menu">
          {/* LEFT FILTER */}
          <div className="left">
            <span>فلترة حسب:</span>
            
            {/* تصفية التصنيف */}
            <div className="filter-group">
              <label>التصنيف:</label><br />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {Object.entries(categoryNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            
            {/* تصفية السعر */}
            <div className="filter-group">
              <span>السعر: </span>
              <div className="price-inputs">
                <input ref={minRef} type="number" placeholder="الحد الأدنى" />
                <span>إلى</span>
                <input ref={maxRef} type="number" placeholder="الحد الأقصى" />
              </div>
            </div>
            
            <button onClick={apply} className="apply-btn">تطبيق الفلترة</button>
          </div>

          {/* RIGHT SORT */}
          <div className="right">
            <span className="sortBy">الترتيب حسب:</span>
            <span className="sortType">
              {sort === "sales" ? "الأكثر مبيعاً" : "الأحدث"}
            </span>
            <img 
              src="/img/down.png" 
              alt="▼" 
              onClick={() => setOpen(!open)} 
              className={`dropdown-icon ${open ? 'open' : ''}`}
            />
            {open && (
              <div className="rightMenu">
                <span 
                  onClick={() => reSort("sales")}
                  className={sort === "sales" ? "active" : ""}
                >
                  الأكثر مبيعاً
                </span>
                <span 
                  onClick={() => reSort("createdAt")}
                  className={sort === "createdAt" ? "active" : ""}
                >
                  الأحدث
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CARDS */}
        <div className="cards">
          {isLoading
            ? <div className="loading">جار التحميل...</div>
            : error
            ? <div className="error">حدث خطأ ما!</div>
            : data.length === 0
            ? <div className="no-results">لم يتم العثور على خدمات تطابق معايير البحث</div>
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;