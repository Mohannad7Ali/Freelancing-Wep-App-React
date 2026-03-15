import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // 🔹 استعلام بيانات الخدمة
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () =>
      newRequest.get(`/gigs/singleGig/${id}`).then((res) => res.data),
  });

  // 🔹 استعلام بيانات المستخدم
  const userId = data?.userId;
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  // 🔹 دالة المراسلة
  const handleContact = async () => {
    if (!currentUser || !dataUser?._id) return;

    const sellerId = dataUser._id;
    const buyerId = currentUser._id;
    const conversationId = sellerId + buyerId;

    try {
      const res = await newRequest.get(
        `/conversations/single/${conversationId}`
      );
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="gig">
      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : error ? (
        <div className="error">حدث خطأ ما!</div>
      ) : (
        <div className="container">
          {/* ================= LEFT SIDE ================= */}
          <div className="left">
            <span className="breadcrumbs">
              Syverr {">"} {data.cat} {">"}
            </span>
            <h1>{data.title}</h1>

            {/* بيانات المستخدم */}
            {isLoadingUser ? (
              "جاري التحميل..."
            ) : errorUser ? (
              "حدث خطأ ما!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt="صورة المستخدم"
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((_, i) => (
                        <i className="fas fa-star" key={i}></i>
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}

            {/* ✅ السلايدر يتحقق إذا كان فيه صور */}
            {data.images && data.images.length > 0 && (
              <Slider slidesToShow={1} arrowsScroll={1} className="slider">
                {data.images.map((img) => (
                  <img key={img} src={img} alt="صورة الخدمة" />
                ))}
              </Slider>
            )}

            <h2>حول هذه الخدمة</h2>
            <p>{data.desc}</p>

            {/* حول البائع */}
            {isLoadingUser ? (
              "جاري التحميل"
            ) : errorUser ? (
              "حدث خطأ ما!"
            ) : (
              <div className="seller">
                <h2>حول البائع</h2>
                <div className="user">
                  <img
                    src={dataUser.img || "/img/noavatar.jpg"}
                    alt="صورة البائع"
                  />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((_, i) => (
                            <i className="fas fa-star" key={i}></i>
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">من</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">عضو منذ</span>
                      <span className="desc">
                        {new Date(dataUser?.createdAt).toLocaleDateString(
                          "ar-AR",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="item">
                      <span className="title">متوسط وقت الاستجابة</span>
                      <span className="desc">4 ساعات</span>
                    </div>
                    <div className="item">
                      <span className="title">آخر تسليم</span>
                      <span className="desc">يوم واحد</span>
                    </div>
                    <div className="item">
                      <span className="title">اللغات</span>
                      <span className="desc">العربية, الإنجليزية</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}

            <Reviews gigId={id} />
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>{data.price} دولار</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <i className="fas fa-clock"></i>
                <span>{data.deliveryDate} أيام للتسليم</span>
              </div>
              <div className="item">
                <i className="fas fa-sync-alt"></i>
                <span>{data.revisionNumber} مراجعات</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <i className="fas fa-check-circle"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {!currentUser?.isSeller && (
              <div className="actions">
                <Link to={`/confirm/${id}`}>
                  <button className="order-btn">متابعة الطلب</button>
                </Link>
                <button className="contact-btn" onClick={handleContact}>
                  <img src="/img/message.png" alt="مراسلة" />
                  <span>مراسلة</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
