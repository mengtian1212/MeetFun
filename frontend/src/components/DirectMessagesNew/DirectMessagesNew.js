import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";

function DirectMessagesNew({ targetUser }) {
  const history = useHistory();
  console.log("targetUser", targetUser);
  const sessionUser = useSelector((state) => state.session.user);

  const [currentMessage, setCurrentMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageContent = currentMessage.trim();
    if (!messageContent) {
      return setCurrentMessage("");
    }
    // socket.emit("chat_message", {
    //   sessionUser,
    //   room: messageId,
    //   content: messageContent,
    //   wasEdited: false,
    //   deleted: false,
    // });

    setCurrentMessage("");
  };

  if (!sessionUser) return <Redirect to="/" />;
  if (!targetUser) history.push(`/messages`);

  return (
    <>
      <div className="dm-otheruser-outer">New Conversation</div>
      <section className="dm-otheruser-outer">
        To: {targetUser?.firstName}&nbsp;
        {targetUser?.lastName}
        <i
          className="fa-solid fa-xmark"
          onClick={() => history.push(`/messages`)}
        ></i>
      </section>

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

export default DirectMessagesNew;
