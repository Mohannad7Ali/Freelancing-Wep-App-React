import React, { useReducer, useState } from "react";
import "./AddProject.scss";
import { projectReducer, INITIAL_STATE } from "../../reducers/projectReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../constants/categories";

const AddProject = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [state, dispatch] = useReducer(projectReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const featureValue = e.target[0].value.trim();
    if (!featureValue) {
      setError("⚠️ يجب إدخال نص للميزة");
      return;
    }
    dispatch({
      type: "ADD_FEATURE",
      payload: featureValue,
    });
    e.target[0].value = "";
    setError(null);
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (project) => {
      return newRequest.post("/projects/create", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myProjects"]);
      setSuccess("✅ تم إنشاء المشروع بنجاح");
      setTimeout(() => navigate("/myprojects"), 1500);
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "❌ فشل في إنشاء المشروع";
      setError(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!state.title || !state.desc || !state.price) {
      setError("⚠️ يجب ملء جميع الحقول المطلوبة");
      return;
    }

    mutation.mutate(state);
  };

  return (
    <div className="add-project">
      <div className="container">
        <h1>إضافة مشروع جديد</h1>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="sections">
          {/* القسم الأول */}
          <div className="info">
            <label>عنوان المشروع</label>
            <input
              type="text"
              name="title"
              placeholder="مثال: مشروع تصميم موقع إلكتروني"
              onChange={handleChange}
              required
            />

            <label>التصنيف</label>
            <select name="cat" onChange={handleChange} required>
              <option value="">اختر تصنيفاً</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label>وصف المشروع</label>
            <textarea
              name="desc"
              placeholder="وصف مفصل للمشروع والمتطلبات"
              rows="6"
              onChange={handleChange}
              required
            ></textarea>

            <button onClick={handleSubmit} disabled={mutation.isLoading}>
              {mutation.isLoading ? "⏳ جاري الحفظ..." : "💾 إنشاء المشروع"}
            </button>
          </div>

          {/* القسم الثاني */}
          <div className="details">
            <label>العنوان المختصر</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="مثال: تصميم موقع تجاري"
              onChange={handleChange}
              required
            />

            <label>الوصف المختصر</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              placeholder="وصف قصير للمشروع"
              rows="3"
              required
            ></textarea>

            <label>مدة التسليم (بالأيام)</label>
            <input
              type="number"
              name="deliveryTime"
              onChange={handleChange}
              min="1"
              required
            />

            <label>الميزانية المتوقعة ($)</label>
            <input
              type="number"
              onChange={handleChange}
              name="price"
              min="1"
              required
            />

            <label>إضافة متطلبات أو ميزات</label>
            <div className="add-features-container">
              <form className="add-features-form" onSubmit={handleFeature}>
                <input type="text" placeholder="مثال: تصميم متجاوب مع الجوال" />
                <button type="submit">إضافة</button>
              </form>
              <div className="features-list">
                {state?.features?.map((f) => (
                  <div className="feature-item" key={f}>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_FEATURE", payload: f })
                      }
                    >
                      {f}
                      <span>✕</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;