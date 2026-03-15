import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Confirm.scss";

const Confirm = () => {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  const handleCreateIntent = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
      if (res.data.success) {
        navigate(`/pay/${id}`, { state: { paymentData: res.data } });
      } else {
        setError("فشل في إنشاء نية الدفع");
      }
    } catch (err) {
      console.error("خطأ أثناء إنشاء الدفع:", err);
      setError(" ربما لديك طلب بالفعل فشل في إنشاء نية الدفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-container">
      <h2 className="confirm-header">تأكيد الطلب</h2>

      {error && <div className="confirm-message error">{error}</div>}

        <div className="order-card">
          <h3 className="order-title">ملخص الطلب</h3>
            <p> هل أنت متأكد من رغبتك في شراء الخدمة</p>
        </div>
    


      <button 
        className="confirm-button"
        onClick={handleCreateIntent}
        disabled={loading}
      >
        {loading ? "جاري إنشاء نية الدفع..." : " تأكيد الطلب و متابعة للدفع 💳"}
      </button>
    </div>
  );
};

export default Confirm;
