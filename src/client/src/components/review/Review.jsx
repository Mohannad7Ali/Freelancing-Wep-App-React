import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";

const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="review">
      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : error ? (
        <div className="error">حدث خطأ!</div>
      ) : (
        <div className="user">
          <img className="pp" src={data.img || "/img/noavatar.jpg"} alt="صورة المستخدم" />
          <div className="info">
            <span>{data.username}</span>
            <div className="country">
              <span>{data.country}</span>
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <i className="fas fa-star" key={i}></i>
          ))}
        <span>{review.star}</span>
      </div>
      <p>{review.desc}</p>
      <div className="helpful">
        <span>هل كان التقييم مفيداً؟</span>
        <div className="feedback-buttons">
          <button className="like-btn">
            <i className="fas fa-thumbs-up"></i>
            <span>نعم</span>
          </button>
          <button className="dislike-btn">
            <i className="fas fa-thumbs-down"></i>
            <span>لا</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;