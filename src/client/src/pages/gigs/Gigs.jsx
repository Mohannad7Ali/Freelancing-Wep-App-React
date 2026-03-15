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
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();

  // استخراج معلمات البحث من URL
  const searchParams = new URLSearchParams(search);
  const urlCategory = searchParams.get("cat");
  
  // تهيئة حالة التصنيف بناءً على معلمة URL إذا وجدت
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort, selectedCategory, priceRange],
    queryFn: () => {
      // بناء معلمات البحث يدويًا
      const params = new URLSearchParams();
      
      if (selectedCategory !== "all") {
        params.append("cat", selectedCategory);
      }
      
      if (priceRange.min) {
        params.append("min", priceRange.min);
      }
      
      if (priceRange.max) {
        params.append("max", priceRange.max);
      }
      
      if (sort) {
        params.append("sort", sort);
      }
      
      return newRequest
        .get(`/gigs/allGigs?${params.toString()}`)
        .then((res) => res.data);
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, selectedCategory, priceRange, refetch]);

  const apply = () => {
    setPriceRange({
      min: minRef.current?.value || "",
      max: maxRef.current?.value || ""
    });
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
                <input 
                  ref={minRef} 
                  type="number" 
                  placeholder="الحد الأدنى" 
                  defaultValue={priceRange.min}
                />
                <span>إلى</span>
                <input 
                  ref={maxRef} 
                  type="number" 
                  placeholder="الحد الأقصى" 
                  defaultValue={priceRange.max}
                />
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
            : data && data.length === 0
            ? <div className="no-results">لم يتم العثور على خدمات تطابق معايير البحث</div>
            : data && data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;