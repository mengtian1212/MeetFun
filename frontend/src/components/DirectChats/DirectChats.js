import "./DirectChats.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  Redirect,
  NavLink,
  useParams,
  useLocation,
} from "react-router-dom";
import { fetchAllDirectChatsThunk } from "../../store/directChats";
import DirectMessages from "./DirectMessages.js";
import { getRandomColor } from "../../utils/helper-functions";
import LoadingPage from "../LoadingPage/LoadingPage";
import DirectMessagesNew from "../DirectMessagesNew/DirectMessagesNew";
import { useModal } from "../../context/Modal";
import NewDMModal from "../NewDMModal/NewDMModal";

function DirectChats() {
  const location = useLocation();
  const { targetUser } = location.state || {};

  const dispatch = useDispatch();
  const { messageId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const directChats = useSelector((state) => state.directChats.allDirectChats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchAllDirectChatsThunk()).then(() => setIsLoading(false));
  }, [dispatch]);

  const { setModalContent } = useModal();
  const handleClickNewDM = () => {
    setModalContent(<NewDMModal />);
  };

  if (!sessionUser) return <Redirect to="/" />;
  if (isLoading) return <LoadingPage />;

  return (
    <>
      <div className="messages-outer">
        <div className="messages-outer-side1">
          <div className="messages-outer-side1-messages">Messages</div>
          <div className="messages-outer-side1-dm bar-focus">
            Direct Messages
          </div>
          <div className="messages-outer-side1-dm">Event Chats</div>
        </div>

        <div className="messages-outer1">
          <div className="messages-outer-side2">
            <div className="new-con">
              <button className="new-dm-btn" onClick={handleClickNewDM}>
                New <i className="fa-solid fa-user-plus" />
              </button>
            </div>
            <section className="messengers-box">
              {Object.values(directChats).map((directChat) => {
                return (
                  <NavLink
                    to={`/messages/${directChat.id}`}
                    key={directChat.id}
                    className="direct-messenger"
                  >
                    {directChat.picture ? (
                      <img
                        src={directChat.picture}
                        alt=""
                        className="member-thumb"
                      />
                    ) : (
                      <div
                        className="member-thumb"
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

                    <div className="messenger-name">
                      {directChat.firstName}&nbsp;
                      {directChat.lastName}
                    </div>
                  </NavLink>
                );
              })}
            </section>
          </div>

          {messageId ? (
            <div className="DM-page">
              <DirectMessages />
            </div>
          ) : targetUser ? (
            <div className="DM-page">
              <DirectMessagesNew targetUser={targetUser} />
            </div>
          ) : (
            <div className="DM-page">
              <div className="DM-page1">
                <i className="fa-regular fa-comment-dots comment-dot"></i>
                <div className="DM-page-click">Click a Chat</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DirectChats;
