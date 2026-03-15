import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();
    if (!messageText) return;
    mutation.mutate({
      conversationId: id,
      desc: messageText,
    });
    e.target.reset();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  return (
    <div className="message">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/messages">💬 الرسائل</Link> / محادثة
        </div>

        {isLoading ? (
          <div className="loading">⏳ جاري تحميل المحادثة...</div>
        ) : error ? (
          <div className="error">⚠️ حدث خطأ أثناء تحميل الرسائل</div>
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={m.userId === currentUser._id ? "item owner" : "item"}
                key={m._id}
              >
                <img
                  src={
                    m.userImg ||
                    (m.userId === currentUser._id
                      ? currentUser.img
                      : "/img/noavatar.jpg")
                  }
                  alt="user"
                  onError={(e) => (e.target.src = "/img/noavatar.jpg")}
                />
                <p>{m.desc}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <form className="write" onSubmit={handleSubmit}>
          <textarea
            name="message"
            placeholder="✍️ اكتب رسالتك هنا..."
            dir="rtl"
          />
          <button type="submit">🚀 إرسال</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
