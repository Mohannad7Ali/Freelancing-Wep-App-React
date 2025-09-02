import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Pay.scss";

const Pay = () => {
  const { id } = useParams(); // orderId
  const location = useLocation();
  const navigate = useNavigate();

  const { paymentData } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleMockPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!paymentData?.payment_intent) {
        throw new Error("بيانات الدفع غير متوفرة - لم يتم إنشاء نية الدفع");
      }

      const res = await newRequest.put("/orders/confirm-payment", {
        payment_intent: paymentData.payment_intent,
        orderId: id,
      });

      if (res.data.success) {
        setSuccess("تمت عملية الدفع بنجاح ✅");
        setTimeout(() => navigate("/orders"), 1500);
      } else {
        throw new Error(res.data.message || "فشل في تأكيد الدفع");
      }
    } catch (err) {
      console.error("تفاصيل الخطأ:", err);
      setError(err.message || "فشلت عملية الدفع بسبب خطأ غير معروف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pay-container">
      <h2 className="pay-header">إتمام الدفع</h2>

      {error && <div className="pay-message error">{error}</div>}
      {success && <div className="pay-message success">{success}</div>}

      {paymentData ? (
        <>
          <div className="pay-card-info">
            <h3 className="pay-card-title">بيانات البطاقة الائتمانية (وهمية)</h3>
            <p className="pay-card-detail">رقم البطاقة: <strong>4242 4242 4242 4242</strong></p>
            <p className="pay-card-detail">تاريخ الانتهاء: <strong>12/34</strong></p>
            <p className="pay-card-detail">CVV: <strong>123</strong></p>
            <p className="pay-card-detail">
              المبلغ: <strong>{paymentData.amount} {paymentData.currency}</strong>
            </p>
          </div>

          <button
            onClick={handleMockPayment}
            className={`pay-button ${loading ? 'pay-button-disabled' : ''}`}
            disabled={loading}
          >
            {loading ? "جاري المعالجة..." : "تنفيذ الدفع (محاكاة)"}
          </button>
        </>
      ) : (
        <p className="pay-warning-note">⚠️ لا يوجد بيانات دفع - ارجع لصفحة التأكيد أولاً</p>
      )}
    </div>
  );
};

export default Pay;
