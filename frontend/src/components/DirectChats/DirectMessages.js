import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import {
  fetchAllDirectChatsThunk,
  fetchSingleDirectChatThunk,
} from "../../store/directChats";
import MessageCard from "./MessageCard";
import "./DirectChats.css";

import { io } from "socket.io-client";

let socket;

function DirectMessages() {
  // const socket = io("http://localhost:8000"); // check for production vs development
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const { messageId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const messageContainerRef = useRef(null);

  const otherUser = useSelector((state) =>
    !isLoading ? state.directChats?.allDirectChats[messageId] : null
  );
  console.log("otherUser~~~~~~~~~~~", otherUser);
  const messages = useSelector((state) =>
    Object.values(state.directChats?.singleDirectChat?.messages)
  );

  const [chatMessages, setChatMessages] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  chatMessages.sort((a, b) => {
    const createdAtA = new Date(a.createdAt).getTime();
    const createdAtB = new Date(b.createdAt).getTime();
    return createdAtA - createdAtB;
  });

  useEffect(() => {
    // Scroll to the bottom when chatMessages change
    if (messageContainerRef && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    (async () => {
      await dispatch(fetchAllDirectChatsThunk());
      const res = await dispatch(fetchSingleDirectChatThunk(messageId));
      setChatMessages(Object.values(res.payload.messages));
      setIsLoading(false);
      window.scroll(0, 0);
      if (res.payload.directChat.id === undefined) {
        history.push("/messages");
      }
    })();
  }, [dispatch, messageId]);

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
  if (isLoading) return null;

  return (
    <>
      <div className="messages-outer-top">
        <section className="dm-otheruser-outer">
          {otherUser?.firstName}&nbsp;
          {otherUser?.lastName}
        </section>

        <section className="dm-messages-outer" ref={messageContainerRef}>
          {chatMessages && Object.values(chatMessages).length === 0 && (
            <div className="DM-page1">
              <i className="fa-regular fa-comment-dots comment-dot"></i>
              <div className="DM-page-click">No messages</div>
            </div>
          )}
          {chatMessages.map((message) => {
            return <MessageCard key={message.id} message={message} />;
          })}
        </section>
      </div>

      <form onSubmit={handleSubmit} className="dm-send-outer">
        <input
          type="text"
          placeholder="Say something nice..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          maxLength={500}
          className="dm-send-box"
        />
        <div className="dm-send-button-box">
          <button
            type="submit"
            disabled={currentMessage.trim().length === 0}
            className="dm-send-button"
          >
            Send
          </button>
          <div className="dm-send-button-box-c">
            {currentMessage.trim().length}/500
          </div>
        </div>
      </form>
      {currentMessage.trim().length >= 500 && (
        <span>Max message length of 500 has been reached</span>
      )}
    </>
  );
}

export default DirectMessages;
