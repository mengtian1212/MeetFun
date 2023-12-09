import { getRandomColor } from "../../utils/helper-functions";

function EventMessageCardSelf({ message }) {
  let formattedDate = new Date(message.createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div className="message-card-outer-self">
      <div className="message-card-line-self">
        <div className="message-card-title">
          <div>
            <div className="message-card-name">
              {message.senderFirstName}&nbsp;
              {message.senderLastName}
            </div>
          </div>
          <div className="message-card-name1">{formattedDate}</div>
        </div>
        <div className="message-content-self">{message.content}</div>
      </div>

      {message.senderPicture ? (
        <img src={message.senderPicture} alt="" className="member-thumb1" />
      ) : (
        <div
          className="member-thumb1"
          style={{
            backgroundColor: getRandomColor(),
          }}
        >
          <span>
            {message.senderFirstName[0]}
            {message.senderLastName[0]}
          </span>
        </div>
      )}
    </div>
  );
}

export default EventMessageCardSelf;
