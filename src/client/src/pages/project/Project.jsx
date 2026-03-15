import React from "react";
import "./Project.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Requests from "../../components/requests/Requests";

function Project() {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ✅ جلب بيانات المشروع
  const {
    isLoading,
    error,
    data: projectData,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () =>
      newRequest.get(`/projects/singleProject/${id}`).then((res) => res.data),
  });

  const userId = projectData?.userId ?? null;

  // ✅ جلب بيانات المستخدم مربوط بالـ project id و userId
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: userData,
  } = useQuery({
    queryKey: ["user", id, userId], // ربط بالـ id علشان ما يخلط بين المشاريع
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId, // الطلب يشتغل بس لما يكون userId موجود
  });

  return (
    <div className="project-page">
      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : error ? (
        <div className="error">حدث خطأ ما!</div>
      ) : (
        <div className="container">
          {/* ================= LEFT ================= */}
          <div className="left">
            <span className="breadcrumbs">
              منصتي {">"} {projectData.cat} {">"}
            </span>
            <h1>{projectData.title}</h1>

            {isLoadingUser ? (
              "جاري تحميل المستخدم..."
            ) : errorUser ? (
              "حدث خطأ في تحميل بيانات المستخدم!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={userData?.img || "/img/noavatar.jpg"}
                  alt="صورة المستخدم"
                />
                <span>{userData?.username}</span>
              </div>
            )}

            <div className="project-section">
              <h2>حول المشروع</h2>
              <p>{projectData.desc}</p>
            </div>

            <div className="project-section">
              <h2>الميزات المطلوبة</h2>
              <div className="features-list">
                {projectData.features.map((feature, index) => (
                  <div className="feature-item" key={index}>
                    <div className="feature-check">
                      <i className="fas fa-check"></i>
                    </div>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {!isLoadingUser && !errorUser && (
              <div className="project-section">
                <h2>حول المستثمر</h2>
                <div className="investor-card">
                  <div className="investor-header">
                    <img
                      src={userData?.img || "/img/noavatar.jpg"}
                      alt="صورة المستثمر"
                      className="investor-avatar"
                    />
                    <div className="investor-info">
                      <span className="investor-name">{userData?.username}</span>
                      <span className="investor-country">{userData?.country}</span>
                    </div>
                  </div>
                  <div className="investor-details">
                    <div className="detail-item">
                      <span className="detail-label">عضو منذ</span>
                      <span className="detail-value">
                        {userData?.createdAt &&
                          new Date(userData.createdAt).toLocaleDateString(
                            "ar-AR",
                            { month: "short", year: "numeric" }
                          )}
                      </span>
                    </div>
                    {userData?.desc && (
                      <>
                        <div className="divider"></div>
                        <p className="investor-bio">{userData.desc}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Requests Section */}
            <Requests projectId={id} projectOwnerId={userId} projectData ={projectData} />
          </div>

          {/* ================= RIGHT ================= */}
          <div className="right">
            <div className="project-card">
              <div className="price-section">
                <h3>{projectData.shortTitle}</h3>
                <h2 className="price">{projectData.price} دولار</h2>
              </div>

              <p className="short-desc">{projectData.shortDesc}</p>

              <div className="project-details">
                <div className="detail-row">
                  <i className="fas fa-clock"></i>
                  <h2> عدد أيام العمل الكلي :</h2>
                  <h1>{projectData.deliveryTime || ""}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;
