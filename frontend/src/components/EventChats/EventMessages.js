import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";

import { io } from "socket.io-client";
import {
  fetchAllEventChatsThunk,
  fetchSingleEventChatThunk,
} from "../../store/eventChats";

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
  const [chatMessages, setChatMessages] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    (async () => {
      await dispatch(fetchAllEventChatsThunk());
      const res = await dispatch(fetchSingleEventChatThunk(eventChatId));
      setChatMessages(Object.values(res.payload.messages));
      setIsLoading(false);
      window.scroll(0, 0);
      if (res.payload.eventChat.id === undefined) {
        history.push("/event-chats");
      }
    })();
  }, [dispatch, eventChatId]);

  if (!sessionUser) return <Redirect to="/" />;
  if (isLoading) return null;

  return (
    <>
      <div className="messages-outer-top">ddd</div>
    </>
  );
}

export default EventMessages;
