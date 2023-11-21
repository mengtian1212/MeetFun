import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { fetchSingleDirectChatThunk } from "../../store/directChats";
import MessageCard from "./MessageCard";
import "./DirectChats.css";

import { io } from "socket.io-client";

let socket;

function DirectMessages() {
  // const socket = io("http://localhost:8000"); // check for production vs development

  const dispatch = useDispatch();
  const history = useHistory();
  const { messageId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const otherUser = useSelector(
    (state) => state.directChats.allDirectChats[messageId]
  );
  const messages = useSelector((state) =>
    Object.values(state.directChats.singleDirectChat.messages)
  );

  const [chatMessages, setChatMessages] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  chatMessages.sort((a, b) => {
    const createdAtA = new Date(a.createdAt).getTime();
    const createdAtB = new Date(b.createdAt).getTime();
    return createdAtA - createdAtB;
  });

  useEffect(() => {
    (async () => {
      const res = await dispatch(fetchSingleDirectChatThunk(messageId));
      setChatMessages(Object.values(res.payload.messages));
      if (res.payload.directChat.id === undefined) {
        history.push("/messages");
      }
    })();
  }, [dispatch, history, messageId]);

  useEffect(() => {
    socket = io();
    socket.on("chat_message", (msg) => {
      console.log("received!!!!", msg);
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.emit("join", {
      room: messageId,
    });

    return () => socket.disconnect();
  }, [messageId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageContent = currentMessage.trim();
    if (!messageContent) {
      return setCurrentMessage("");
    }
    socket.emit("chat_message", {
      sessionUser,
      room: messageId,
      content: messageContent,
      wasEdited: false,
      deleted: false,
    });

    setCurrentMessage("");
  };

  if (!sessionUser) return <Redirect to="/" />;

  return (
    <>
      <div className="messages-outer-top">
        <section className="dm-otheruser-outer">
          {otherUser?.firstName}&nbsp;
          {otherUser?.lastName}
        </section>

        <section className="dm-messages-outer">
          {chatMessages.map((message) => {
            return <MessageCard key={message.id} message={message} />;
          })}
        </section>
      </div>

      <section className="dm-send-outer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Say something nice..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            maxLength={500}
          />
          <div>{currentMessage.trim().length}/500</div>
          <button type="submit" disabled={currentMessage.trim().length === 0}>
            Send
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
        {currentMessage.trim().length >= 500 && (
          <span>Max message length of 500 has been reached</span>
        )}
      </section>
    </>
  );
}

export default DirectMessages;
