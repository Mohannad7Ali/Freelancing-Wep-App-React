import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs/allGigs?userId=${currentUser?._id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["myGigs"]),
  });

  const handleDelete = (id) => mutation.mutate(id);

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>خدماتي</h1>
          {currentUser?.isSeller && (
            <Link to="/add">
              <button className="add-btn">+ إضافة خدمة جديدة</button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <p className="loading">جاري تحميل خدماتك...</p>
        ) : error ? (
          <p className="error">حدث خطأ أثناء تحميل الخدمات</p>
        ) : data && data.length > 0 ? (
          <div className="gigs-grid">
            {data.map((gig) => (
              <div key={gig._id} className="gig-card">
                <img src={gig.cover} alt={gig.title} className="gig-image" />
                <div className="gig-content">
                  <h3>{gig.title}</h3>
                  <p className="price">{gig.price}$</p>
                  <p className="sales">المبيعات: {gig.sales}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(gig._id)}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-gigs">
            <img src="/img/notfound2.png" alt="لا توجد خدمات" />
            <p>لا توجد خدمات مضافة حتى الآن</p>
            {currentUser?.isSeller && (
              <Link to="/add" className="cta-btn">
                أضف أول خدمة لك
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyGigs;
