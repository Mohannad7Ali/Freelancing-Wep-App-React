import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest
        .get(`/orders`)
        .then((res) => (Array.isArray(res.data?.data) ? res.data.data : []))
        .catch(() => []),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const ordersData = Array.isArray(data) ? data : [];

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>الطلبات</h1>
          {ordersData.length > 0 && (
            <span className="count">عدد الطلبات: {ordersData.length}</span>
          )}
        </div>

        {isLoading ? (
          <div className="state loading">⏳ جاري تحميل الطلبات...</div>
        ) : error ? (
          <div className="state error">⚠️ حدث خطأ أثناء جلب الطلبات</div>
        ) : ordersData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>الخدمة</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>المراسلة</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => {
                        navigate(`/pay/${order.gigId}`, { state: { paymentData: order } });
                  }}
                  className="order-row"
                >
                  <td>{order.title}</td>
                  <td>
                    {order.price} <sup>$</sup>
                  </td>
                  <td>
                    {order.isCompleted ? (
                      <span className="badge completed">مكتمل</span>
                    ) : (
                      <span className="badge pending">قيد التنفيذ</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="contact-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // عشان ما يفتح صفحة الدفع بالغلط
                        handleContact(order);
                      }}
                    >
                      <img src="/img/message.png" alt="مراسلة" />
                      <span>مراسلة</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-orders">
            <img src="/img/notfound2.png" alt="لا توجد طلبات" />
            <p>لا توجد طلبات لعرضها حالياً</p>
            <Link to="/gigs" className="browse-gigs">
              تصفح الخدمات
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
