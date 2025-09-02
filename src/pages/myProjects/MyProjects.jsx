import React from "react";
import { Link } from "react-router-dom";
import "./MyProjects.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyProjects() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myProjects"],
    queryFn: () =>
      newRequest.get(`/projects/allProjects?userId=${currentUser?._id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["myProjects"]),
  });

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المشروع؟")) {
      mutation.mutate(id);
    }
  };

  const getStatusBadge = (status) => {
    return status === "open" 
      ? <span className="status-badge open">مفتوح</span> 
      : <span className="status-badge closed">مغلق</span>;
  };

  return (
    <div className="myProjects">
      <div className="container">
        <div className="title">
          <h1>مشاريعي</h1>
          {currentUser?.isClient && (
            <Link to="/add-project">
              <button className="add-btn">+ إضافة مشروع جديد</button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <p className="loading">جاري تحميل مشاريعك...</p>
        ) : error ? (
          <p className="error">حدث خطأ أثناء تحميل المشاريع</p>
        ) : data && data.length > 0 ? (
          <div className="projects-grid">
            {data.map((project) => (
              <div key={project._id} className="project-card">
                <div className="card-header">
                  <h3 className="project-title">{project.title}</h3>
                  {getStatusBadge(project.status)}
                </div>
                
                <div className="project-content">
                  <p className="project-desc">{project.desc}</p>
                  
                  <div className="project-details">
                    <div className="detail-item">
                      <span className="label">الميزانية:</span>
                      <span className="value">{project.price}$</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">مدة التسليم:</span>
                      <span className="value">{project.deliveryTime} يوم</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="label">التصنيف:</span>
                      <span className="value">{project.cat}</span>
                    </div>
                  </div>
                  
                  {project.features && project.features.length > 0 && (
                    <div className="project-features">
                      <h4>المتطلبات:</h4>
                      <div className="features-list">
                        {project.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                        {project.features.length > 3 && (
                          <span className="more-features">+{project.features.length - 3} أكثر</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <Link to={`/project/${project._id}`} className="view-btn">
                    عرض التفاصيل
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(project._id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <img src="/img/notfound2.png" alt="لا توجد مشاريع" />
            <p>لا توجد مشاريع مضافة حتى الآن</p>
            {currentUser?.isClient && (
              <Link to="/add-project" className="cta-btn">
                أضف أول مشروع لك
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;