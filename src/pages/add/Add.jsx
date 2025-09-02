import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../constants/categories";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

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

  const handleUpload = async () => {
    if (!singleFile) {
      setError("⚠️ يجب إضافة صورة غلاف للخدمة قبل رفع الصور");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );

      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      setSuccess("✅ تم رفع الصور بنجاح");
    } catch (err) {
      setUploading(false);
      setError("❌ فشل في رفع الصور. يرجى المحاولة مرة أخرى");
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs/create", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setSuccess("✅ تم إنشاء الخدمة بنجاح");
      setTimeout(() => navigate("/mygigs"), 1500);
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "❌ فشل في إنشاء الخدمة";
      setError(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!state.cover) {
      setError("⚠️ يجب رفع صورة غلاف للخدمة قبل إنشاء الخدمة");
      return;
    }

    if (!state.title || !state.desc || !state.price) {
      setError("⚠️ يجب ملء جميع الحقول المطلوبة");
      return;
    }

    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>إضافة خدمة جديدة</h1>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="sections">
          {/* القسم الأول */}
          <div className="info">
            <label>عنوان الخدمة</label>
            <input
              type="text"
              name="title"
              placeholder="مثال: سأقوم بتصميم موقع احترافي"
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

            <div className="images">
              <div className="imagesInputs">
                <div>
                  <label>صورة الغلاف</label>
                  <input
                    type="file"
                    onChange={(e) => setSingleFile(e.target.files[0])}
                    required
                  />
                </div>
                <div>
                  <label>الصور الإضافية</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>
              </div>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "⏳ جاري الرفع..." : "⬆️ رفع الصور"}
              </button>
            </div>

            <label>الوصف</label>
            <textarea
              name="desc"
              placeholder="وصف مختصر لخدمتك"
              rows="6"
              onChange={handleChange}
              required
            ></textarea>

            <button onClick={handleSubmit} disabled={mutation.isLoading}>
              {mutation.isLoading ? "⏳ جاري الحفظ..." : "💾 إنشاء الخدمة"}
            </button>
          </div>

          {/* القسم الثاني */}
          <div className="details">
            <label>العنوان المختصر</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="مثال: تصميم موقع صفحة واحدة"
              onChange={handleChange}
              required
            />

            <label>الوصف المختصر</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              placeholder="وصف قصير للخدمة"
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

            <label>عدد المراجعات</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
              min="1"
              required
            />

            <label>إضافة ميزات</label>
            <div className="add-features-container">
              <form className="add-features-form" onSubmit={handleFeature}>
                <input type="text" placeholder="مثال: تصميم الصفحة الرئيسية" />
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

            <label>السعر ($)</label>
            <input
              type="number"
              onChange={handleChange}
              name="price"
              min="1"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
