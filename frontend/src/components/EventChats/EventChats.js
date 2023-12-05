import "./EventChats.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  Redirect,
  NavLink,
  useParams,
  useLocation,
} from "react-router-dom";
import LoadingPage from "../LoadingPage";
import { fetchAllEventChatsThunk } from "../../store/eventChats";
import EventMessages from "./EventMessages";

function EventChats() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventChatId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);
  const eventChats = useSelector((state) => state.eventChats.allEventChats);

  useEffect(() => {
    dispatch(fetchAllEventChatsThunk()).then(() => setIsLoading(false));
  }, [dispatch]);

  const handleClickDM = () => {
    history.push(`/messages`);
    window.scroll(0, 0);
  };

  const handleClickEventChat = () => {
    history.push(`/event-chats`);
    window.scroll(0, 0);
  };

  if (!sessionUser) return <Redirect to="/" />;
  if (isLoading) return <LoadingPage />;

  return (
    <>
      <div className="messages-outer">
        <div className="messages-outer-side1">
          <div className="messages-outer-side1-messages">Messages</div>
          <div className="messages-outer-side1-dm" onClick={handleClickDM}>
            Direct Messages
          </div>
          <div
            className="messages-outer-side1-dm bar-focus"
            onClick={handleClickEventChat}
          >
            Event Chats
          </div>
        </div>

        <div className="messages-outer1">
          <div className="messages-outer-side2">
            <div className="new-con">
              <button className="new-dm-btn"></button>
            </div>
            <section className="messengers-box">
              {eventChats &&
                Object.values(eventChats).map((eventChat) => {
                  return (
                    <NavLink
                      to={`/event-chats/${eventChat?.eventChatId}`}
                      key={eventChat?.eventChatId}
                      className="direct-messenger"
                    >
                      <img
                        src={
                          eventChat?.eventImage
                            ? eventChat?.eventImage
                            : "https://secure.meetupstatic.com/next/images/find/emptyResultsIcon.svg"
                        }
                        alt=""
                        className="member-thumb"
                      />

                      <div className="messenger-name1">
                        {eventChat?.eventName}
                      </div>
                    </NavLink>
                  );
                })}
            </section>
          </div>

          {eventChatId ? (
            <div className="DM-page">
              <EventMessages />
            </div>
          ) : (
            <div className="DM-page">
              <div className="DM-page1">
                <i className="fa-regular fa-comment-dots comment-dot"></i>
                <div className="DM-page-click">Click an Event Chat</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EventChats;
