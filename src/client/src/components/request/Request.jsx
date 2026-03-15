import React, { useState } from "react";
import "./Request.scss";
import { Mail, Handshake, Trash2 } from "lucide-react";
import newRequest from "../../utils/newRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Request = ({ request, isBuyer, handleContact, projectData }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const [showContractModal, setShowContractModal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ Check if current user is the project owner (buyer)
  const isProjectOwner = currentUser && currentUser._id === projectData.userId;

  // ✅ Mutation لحذف الطلب
  const deleteMutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["requests"]);
    },
    onError: (err) => {
      console.error("خطأ أثناء الحذف:", err);
      alert("حدث خطأ أثناء حذف الطلب!");
    },
  });

  // ✅ Mutation للتعاقد
  const contractMutation = useMutation({
    mutationFn: (contractData) => 
      newRequest.put(`/projects/contract/${request.projectId}`, contractData),
    onSuccess: () => {
      // تحديث البيانات بعد التعاقد
      queryClient.invalidateQueries(["requests"]);
      setShowContractModal(false);
      alert("تم التعاقد بنجاح!");
    },
    onError: (err) => {
      console.error("خطأ أثناء التعاقد:", err);
      alert(err.response?.data || "حدث خطأ أثناء التعاقد!");
    },
  });

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟")) {
      deleteMutation.mutate(request._id);
    }
  };

  const handleContract = () => {
    setShowContractModal(true);
  };

  const confirmContract = () => {
    contractMutation.mutate({
      contractorId: request.userId // إرسال معرف المطور الذي قدم الطلب
    });
  };

  const cancelContract = () => {
    setShowContractModal(false);
  };

  return (
    <>
      <div className="request-card">
        <div className="request-header">
          <div className="seller-info">
            <img
              src={request.sellerImg || "/img/noavatar.jpg"}
              alt={request.sellerName}
              className="seller-avatar"
            />
            <div className="seller-details">
              <h4 className="seller-name">{request.sellerName}</h4>
              <span className="request-date">
                تم النشر في: {formatDate(request.createdAt)}
              </span>
            </div>
          </div>
          <div className="request-budget">
            <span className="budget-label">الميزانية</span>
            <span className="budget-amount">${request.budget}</span>
          </div>
        </div>

        <div className="request-body">
          <div className="request-section">
            <h5>وصف العرض:</h5>
            <p className="request-description">{request.desc}</p>
          </div>
        </div>

        {/* ✅ Show contact and contract buttons only to the project owner (buyer) */}
        {isProjectOwner && (
          <div className="request-actions">
            <div className="action-buttons">
              <button
                className="btn contact-btn"
                onClick={() => handleContact(request.userId)}
                title="تواصل مع البائع"
              >
                <Mail size={16} />
                <span>تواصل</span>
              </button>
              <button 
                className="btn contract-btn"
                onClick={handleContract}
                disabled={contractMutation.isLoading}
              >
                <Handshake size={16} />
                <span>تعاقد مع المطور</span>
              </button>
            </div>
          </div>
        )}

        {/* ✅ زر الحذف يظهر فقط لصاحب الطلب (المطور) */}
        {currentUser && currentUser._id === request.userId && (
          <div className="request-actions">
            <button
              className="btn delete-btn"
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
            >
              <Trash2 size={16} />
              {deleteMutation.isLoading ? "جاري الحذف..." : "حذف الطلب"}
            </button>
          </div>
        )}

        {request.status && (
          <div className={`request-status status-${request.status}`}>
            <i
              className={`fas ${
                request.status === "accepted"
                  ? "fa-check-circle"
                  : request.status === "rejected"
                  ? "fa-times-circle"
                  : "fa-clock"
              }`}
            ></i>
            <span>
              {request.status === "accepted"
                ? "مقبول"
                : request.status === "rejected"
                ? "مرفوض"
                : "قيد المراجعة"}
            </span>
          </div>
        )}
      </div>

      {/* ✅ مودال تأكيد التعاقد */}
      {showContractModal && (
        <div className="contract-modal-overlay">
          <div className="contract-modal">
            <div className="modal-header">
              <h3>تأكيد التعاقد</h3>
              <button className="close-btn" onClick={cancelContract}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                هل أنت متأكد أنك تريد التعاقد مع <strong>{request.userInfo.username}</strong>؟
              </p>
              <div className="contract-details">
                <div className="detail-item">
                  <span>الميزانية المتفق عليها:</span>
                  <span className="budget">${request.budget}</span>
                </div>
                <div className="detail-item">
                  <span>وصف المشروع:</span>
                  <span>{request.desc.substring(0, 100)}...</span>
                </div>
              </div>
              <p className="warning-text">
                ⚠️ بعد التأكيد، سيتم إغلاق المشروع للطلبات الأخرى وسيبدأ مرحلة التنفيذ.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn cancel-btn"
                onClick={cancelContract}
                disabled={contractMutation.isLoading}
              >
                إلغاء
              </button>
              <button
                className="btn confirm-btn"
                onClick={confirmContract}
                disabled={contractMutation.isLoading}
              >
                {contractMutation.isLoading ? "جاري التعاقد..." : "نعم، التعاقد الآن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Request;