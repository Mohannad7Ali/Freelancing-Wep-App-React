import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Request from "../request/Request";
import "./Requests.scss";
import { validateReview } from "../../utils/reviewValidation";

const Requests = ({ projectId, projectOwnerId  , projectData}) => {
  const queryClient = useQueryClient();
  const [requestText, setRequestText] = useState("");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["requests", projectId],
    queryFn: () =>
      newRequest.get(`/requests/${projectId}`).then((res) => res.data),
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const mutation = useMutation({
    mutationFn: (request) => newRequest.post("/requests", request),
    onSuccess: () => {
      queryClient.invalidateQueries(["requests", projectId]);
      setRequestText("");
      setBudget("");
      setErrors([]);
      setServerError("");
    },
    onError: (err) => {
      setServerError(err.response?.data?.message || " ربما لديك طلب مرسل بالفعل حدث خطأ أثناء إرسال الطلب");
    }
  });

  // contact conversation
  const handleContact = async (userId) => {
    if (!currentUser || !userId) return;

    const buyerId = currentUser._id;
    const conversationId = userId+buyerId ;

    try {
      const res = await newRequest.get(`/conversations/single/${conversationId}`);
      window.location.href = `/message/${res.data.id}`;
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: userId,
        });
        window.location.href = `/message/${res.data.id}`;
      }
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    // التحقق من الوصف
    const textValidation = validateReview(requestText);
    if (!textValidation.ok) {
      newErrors.push(...textValidation.errors);
    }
    
    // التحقق من الميزانية
    if (!budget.trim()) {
      console.log(projectData)
      newErrors.push("يرجى إدخال الميزانية");
    } else if (isNaN(budget) || parseFloat(budget) <= 0) {
      newErrors.push("يجب أن تكون الميزانية رقمًا صحيحًا أكبر من الصفر");
    }
    else if (parseFloat(budget) > projectData.price) {
      newErrors.push("الميزانية كبيرة جدًا تتجاوز ميزانية المشروع" );
    } else if (parseFloat(budget) < projectData.price/4) {
      newErrors.push("الميزانية صغيرة جدًا أقل من ربع ميزانية المشروع" );
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");
    
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    mutation.mutate({
      projectId,
      desc: requestText,
      budget: parseFloat(budget),
    });
  };

  const handleInputChange = (e) => {
    setRequestText(e.target.value);
    // مسح الأخطاء عند البدء بالكتابة
    if (errors.length > 0) {
      const textValidation = validateReview(e.target.value);
      if (textValidation.ok) {
        setErrors(errors.filter(error => !error.includes("الوصف")));
      }
    }
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    // السماح فقط بالأرقام والنقاط
    if (/^\d*\.?\d*$/.test(value)) {
      setBudget(value);
      // مسح أخطاء الميزانية عند البدء بالكتابة
      if (errors.length > 0 && value && !isNaN(value) && parseFloat(value) > 0) {
        setErrors(errors.filter(error => !error.includes("الميزانية")));
      }
    }
  };

  return (
    <div className="requests">
      <div className="requests-header">
        <h2>طلبات العمل على المشروع</h2>
        {data && data.length > 0 && (
          <span className="requests-count">({data.length} طلب)</span>
        )}
      </div>

      {/* رسائل الخطأ من الخادم */}
      {serverError && (
        <div className="server-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{serverError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الطلبات...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <p>حدث خطأ أثناء تحميل الطلبات!</p>
        </div>
      ) : data && data.length > 0 ? (
        <div className="requests-list">
          {data.map((request) => (
            <Request
              key={request._id}
              request={request}
              isBuyer={currentUser?._id === projectOwnerId}
              handleContact={handleContact}
            />
          ))}
        </div>
      ) : (
        <div className="no-requests">
          <i className="fas fa-inbox"></i>
          <p>لا توجد طلبات حتى الآن.</p>
        </div>
      )}

      {currentUser?.isSeller && (
        <div className="request-form-container">
          <h3>تقديم عرض جديد</h3>
          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="request-description">وصف العرض *</label>
              <textarea
                id="request-description"
                placeholder="صف مهاراتك، خبراتك، وكيف يمكنك إنجاز هذا المشروع بنجاح..."
                value={requestText}
                onChange={handleInputChange}
                rows="5"
                className={errors.some(e => e.includes("الوصف")) ? "error" : ""}
              />
              <div className="char-counter">
                {requestText.length}/500 حرف
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="request-budget">الميزانية المقترحة ($) *</label>
              <input
                id="request-budget"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={budget}
                onChange={handleBudgetChange}
                className={errors.some(e => e.includes("الميزانية")) ? "error" : ""}
              />
              <div className="budget-hint">أدخل الميزانية بالدولار الأمريكي</div>
            </div>

            {errors.length > 0 && (
              <div className="validation-errors">
                <h4>يرجى تصحيح الأخطاء التالية:</h4>
                <ul>
                  {errors.map((err, i) => (
                    <li key={i}>
                      <i className="fas fa-exclamation-circle"></i>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={mutation.isLoading || requestText.length === 0 || budget.length === 0}
            >
              {mutation.isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  إرسال العرض
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Requests;