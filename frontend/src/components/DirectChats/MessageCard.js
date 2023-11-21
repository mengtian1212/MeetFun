import { getRandomColor } from "../../utils/helper-functions";

function MessageCard({ message }) {
  let formattedDate = new Date(message.createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div>
      {message.senderPicture ? (
        <img src={message.senderPicture} alt="" className="member-image" />
      ) : (
        <div
          className="member-image"
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

      <div>
        <div>
          <div>
            {message.senderFirstName}&nbsp;
            {message.senderLastName}
          </div>
        </div>
        <div>{formattedDate}</div>
      </div>
      <div>{message.content}</div>
    </div>
  );
}

export default MessageCard;
