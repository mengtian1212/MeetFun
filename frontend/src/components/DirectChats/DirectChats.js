import "./DirectChats.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect, NavLink, useParams } from "react-router-dom";
import { fetchAllDirectChatsThunk } from "../../store/directChats";
import DirectMessages from "./DirectMessages.js";
import { getRandomColor } from "../../utils/helper-functions";

function DirectChats() {
  const dispatch = useDispatch();
  const { messageId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const directChats = useSelector((state) => state.directChats.allDirectChats);

  useEffect(() => {
    dispatch(fetchAllDirectChatsThunk());
  }, [dispatch]);

  if (!sessionUser) return <Redirect to="/" />;

  return (
    <div className="messages-outer">
      <section>
        <div>Messages</div>
        <div>Direct Messages</div>
        <div>Event Chats</div>
      </section>
      <section>
        {Object.values(directChats).map((directChat) => {
          return (
            <div key={directChat.id}>
              <NavLink to={`/messages/${directChat.id}`}>
                {directChat.picture ? (
                  <img
                    src={directChat.picture}
                    alt=""
                    className="member-image"
                  />
                ) : (
                  <div
                    className="member-image"
                    style={{
                      backgroundColor: getRandomColor(),
                    }}
                  >
                    <span>
                      {directChat.firstName[0]}
                      {directChat.lastName[0]}
                    </span>
                  </div>
                )}

                <div>
                  {directChat.firstName}&nbsp;
                  {directChat.lastName}
                </div>
              </NavLink>
            </div>
          );
        })}
      </section>

      <section>
        {messageId ? (
          <div className="DM-page">
            <DirectMessages />
          </div>
        ) : (
          <div className="DM-page"></div>
        )}
      </section>
    </div>
  );
}

export default DirectChats;
