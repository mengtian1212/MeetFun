import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";

import { io } from "socket.io-client";
import {
  fetchAllEventChatsThunk,
  fetchSingleEventChatThunk,
} from "../../store/eventChats";
import { fetchSingleEventThunk } from "../../store/events";
import {
  capitalizeFirstChar,
  formatDateTime,
  replaceThirdCommaDot,
} from "../../utils/helper-functions";
import EventMessageCard from "./EventMessageCard";

let socket;

function EventMessages() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventChatId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const messageContainerRef = useRef(null);

  const messages = useSelector((state) =>
    Object.values(state.eventChats?.singleEventChat?.messages)
  );
  const targetEvent = useSelector((state) => state.events?.singleEvent);

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
      await dispatch(fetchAllEventChatsThunk());
      const res = await dispatch(fetchSingleEventChatThunk(eventChatId));
      await dispatch(fetchSingleEventThunk(res.payload.eventChat.eventId));
      setChatMessages(Object.values(res.payload.messages));
      setIsLoading(false);
      window.scroll(0, 0);
      if (res.payload.eventChat.id === undefined) {
        history.push("/event-chats");
      }
    })();
  }, [dispatch, eventChatId]);

  const handleSubmit = () => {};

  if (!sessionUser) return <Redirect to="/" />;
  if (isLoading) return null;

  return (
    <>
      <div className="messages-outer-top1">
        <section className="dm-otheruser-outer1">
          <section>{targetEvent?.name}</section>

          <section className="dm-otheruser-outer2">
            <div className="dm-otheruser-outer3">
              <i className="fa-regular fa-calendar"></i>
              {new Date(targetEvent?.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <div className="dm-otheruser-outer3">
              {targetEvent?.type === "In person" &&
                targetEvent?.Venue &&
                Object.keys(targetEvent?.Venue).length && (
                  <>
                    <i className="fa-solid fa-location-dot"></i>
                    {targetEvent?.Venue?.address}
                    {", "}
                    {capitalizeFirstChar(targetEvent.Venue?.city)}
                    {",  "}
                    {targetEvent.Venue?.state}
                  </>
                )}
              {targetEvent?.type !== "In person" && (
                <>
                  <i className="fa-solid fa-video"></i>Online
                </>
              )}
            </div>
          </section>
        </section>

        <section className="dm-messages-outer1" ref={messageContainerRef}>
          {chatMessages && Object.values(chatMessages).length === 0 && (
            <div className="DM-page1">
              <i className="fa-regular fa-comment-dots comment-dot"></i>
              <div className="DM-page-click">No messages</div>
            </div>
          )}
          {chatMessages.map((message) => {
            return <EventMessageCard key={message.id} message={message} />;
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

export default EventMessages;
