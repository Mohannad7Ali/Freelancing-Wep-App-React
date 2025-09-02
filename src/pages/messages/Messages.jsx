import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="messages">
      {isLoading ? (
        "جاري التحميل..."
      ) : error ? (
        "حدث خطأ!"
      ) : (
        <div className="container">
          <div className="title">
            <h1>📩 الرسائل</h1>
          </div>
          <table>
            <thead>
            
                <th>{currentUser.isSeller ? "المشتري" : "البائع"}</th>
                <th>آخر رسالة</th>
                <th>التاريخ</th>
                <th>إجراء</th>
            
            </thead>
            <tbody>
              {data.map((c) => {
                const otherUser = currentUser.isSeller ? c.buyer : c.seller;
                return (
                  <tr
                    className={
                      ((currentUser.isSeller && !c.readBySeller) ||
                        (!currentUser.isSeller && !c.readByBuyer)) && "active"
                    }
                    key={c.id}
                    onClick={() =>
                      (window.location.href = `/message/${c.id}`)
                    }
                  >
                    {/* العمود الأول: صورة + اسم */}
                    <td>
                      <div className="user-info">
                        <img
                          src={otherUser?.img || "/img/noavatar.jpg"}
                          alt="user"
                          onError={(e) => (e.target.src = "/img/noavatar.jpg")}
                        />
                        <span>{otherUser?.username || "مستخدم"}</span>
                      </div>
                    </td>

                    {/* العمود الثاني: آخر رسالة */}
                    <td>
                      {c?.lastMessage
                        ? c.lastMessage.substring(0, 50) + "..."
                        : "—"}
                    </td>

                    {/* العمود الثالث: الوقت */}
                    <td>{moment(c.updatedAt).fromNow()}</td>

                    {/* العمود الرابع: زر */}
                    <td>
                      {((currentUser.isSeller && !c.readBySeller) ||
                        (!currentUser.isSeller && !c.readByBuyer)) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // منع فتح المحادثة عند الضغط على الزر
                            handleRead(c.id);
                          }}
                        >
                          تم القراءة ✅
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
