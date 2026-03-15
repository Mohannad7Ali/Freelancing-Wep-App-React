import React, { useEffect, useRef, useState } from "react";
import "./Projects.scss";
import ProCard from "../../components/proCard/ProCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Projects() {
  const [sort, setSort] = useState("createdAt");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["projects", sort, selectedCategory, filtersApplied],
    queryFn: () => {
      // بناء معلمات البحث بشكل صحيح
      const params = new URLSearchParams();
      
      // إضافة معلمات التصفية
      if (minRef.current?.value) params.append("min", minRef.current.value);
      if (maxRef.current?.value) params.append("max", maxRef.current.value);
      params.append("sort", sort);
      if (selectedCategory !== "all") params.append("cat", selectedCategory);
      
      return newRequest
        .get(`/projects/allProjects?${params.toString()}`)
        .then((res) => res.data);
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, selectedCategory, refetch]);

  const apply = () => {
    setFiltersApplied(prev => !prev); // تغيير حالة لتشغيل إعادة الجلب
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
    "AI Services": "خدمات الذكاء الاصطناعي",
  };

  return (
    <div className="Projects">
      <div className="container">
        <span className="breadcrumbs">syverr</span>
        <h1>المشاريع المتاحة</h1>
        <p>قم باستكشاف المشاريع المفتوحة وابدأ بعملك الآن</p>

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
              <span>الميزانية: </span>
              <div className="price-inputs">
                <input 
                  ref={minRef} 
                  type="number" 
                  placeholder="الحد الأدنى" 
                  min="0"
                />
                <span>إلى</span>
                <input 
                  ref={maxRef} 
                  type="number" 
                  placeholder="الحد الأقصى" 
                  min="0"
                />
              </div>
            </div>
            
            <button onClick={apply} className="apply-btn">تطبيق الفلترة</button>
          </div>

          {/* RIGHT SORT */}
          <div className="right">
            <span className="sortBy">الترتيب حسب:</span>
            <span className="sortType">
              {sort === "createdAt" ? "الأحدث" : "الأكثر مبيعاً"}
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
                  onClick={() => reSort("createdAt")}
                  className={sort === "createdAt" ? "active" : ""}
                >
                  الأحدث
                </span>
                <span 
                  onClick={() => reSort("sales")}
                  className={sort === "sales" ? "active" : ""}
                >
                  الأكثر مبيعاً
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
            ? <div className="no-results">لم يتم العثور على مشاريع تطابق معايير البحث</div>
            : data.map((project) => <ProCard key={project._id} item={project} />)}
        </div>
      </div>
    </div>
  );
}

export default Projects;