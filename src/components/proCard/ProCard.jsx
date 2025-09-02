import React from "react";
import "./ProCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const ProCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () => newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  // تحديد لون الحالة بناءً على حالة المشروع
  const getStatusColor = () => {
    return item.status ? "#E63946" : "#1E90FF"; // أحمر للمغلق، أزرق للمفتوح
  };

  // تقليل النص الطويل إذا تجاوز طول معين
  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link to={`/project/${item._id}`} className="link">
      <div className="proCard">
        <div className="cardHeader">
          {isLoading ? (
            <div className="loadingUser">جاري التحميل...</div>
          ) : error ? (
            <div className="errorUser">حدث خطأ!</div>
          ) : (
            <div className="userInfo">
              <img src={data.img || "/img/noavatar.jpg"} alt={data.username} />
              <div className="userDetails">
                <span className="username">{data.username}</span>
                <span className="userTitle">Client </span>
              </div>
            </div>
          )}
        </div>

        <div className="cardBody">
          <h1 className="description">{truncateDescription(item.title)}</h1><br />
          <p className="description">{truncateDescription(item.desc)}</p>
        </div>

        <div className="cardFooter">
          <div className="projectDetails">
            <div className="detailItem status">
              <span className="detailLabel">حالة المشروع</span>
              <span 
                className="detailValue statusValue"
                style={{ color: getStatusColor() }}
              >
                {item.status }
                <i className={`statusIcon ${item.status ? 'fas fa-lock' : 'fas fa-lock-open'}`}></i>
              </span>
            </div>
            
            <div className="detailItem">
              <span className="detailLabel">أيام التسليم</span>
              <span className="detailValue">
                <i className="far fa-calendar-alt"></i>
                {item.deliveryTime}
              </span>
            </div>
            
            <div className="detailItem price">
              <span className="detailLabel">الميزانية</span>
              <span className="detailValue priceValue">
                <i className="fas fa-dollar-sign"></i>
                {item.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProCard;