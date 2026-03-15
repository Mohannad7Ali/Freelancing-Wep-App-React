import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";
import { validateReview } from "../../utils/reviewValidation";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState("");
  const [selectedStars, setSelectedStars] = useState(5);
  const [errors, setErrors] = useState([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const mutation = useMutation({
    mutationFn: (review) => newRequest.post("/reviews", review),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      setReviewText("");
      setSelectedStars(5);
      setErrors([]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateReview(reviewText);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    mutation.mutate({ gigId, desc: reviewText, star: selectedStars });
  };

  return (
    <div className="reviews">
      <div className="reviews-header">
        <h2>التقييمات</h2>
        {data && data.length > 0 && (
          <span className="reviews-count">({data.length} تقييم)</span>
        )}
      </div>
      
      {isLoading ? (
        <div className="reviews-loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل التقييمات...</p>
        </div>
      ) : error ? (
        <div className="reviews-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>حدث خطأ أثناء تحميل التقييمات!</p>
        </div>
      ) : data && data.length > 0 ? (
        <div className="reviews-list">
          {data.map((review) => (
            <Review key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <i className="fas fa-comments"></i>
          <p>لا توجد تقييمات حتى الآن.</p>
        </div>
      )}
      
      {!currentUser?.isSeller && (
        <div className="add-review">
          <div className="add-review-header">
            <h3>أضف تقييمك</h3>
            <div className="rating-preview">
              {Array(selectedStars).fill().map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
          </div>
          
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                placeholder="شاركنا تجربتك مع هذه الخدمة..."
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  const result = validateReview(e.target.value);
                  setErrors(result.ok ? [] : result.errors);
                }}
                rows="4"
                className="review-textarea"
              />
              <div className="textarea-counter">{reviewText.length}/500</div>
            </div>

            {errors.length > 0 && (
              <div className="review-errors">
                <ul>
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="form-actions">
              <div className="stars-selector">
                <label>قيم الخدمة:</label>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <React.Fragment key={star}>
                      <input
                        type="radio"
                        id={`star-${star}`}
                        name="rating"
                        value={star}
                        checked={selectedStars === star}
                        onChange={() => setSelectedStars(star)}
                      />
                      <label htmlFor={`star-${star}`} className="star-label">
                        <i className="fas fa-star"></i>
                        <span>{star}</span>
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit" 
                className="submit-review-btn"
                disabled={mutation.isLoading || !reviewText.trim() || errors.length > 0}
              >
                {mutation.isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    إرسال التقييم
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;