import "./GroupsList.css";
import { useHistory } from "react-router-dom";

function GroupListCard({ group }) {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/groups/${group.id}`);
  };
  return (
    <>
      <div className="group-list-card cursor" onClick={handleClick}>
        <div className="group-list-img-container">
          <img
            src={
              group.previewImage === `No preview image for this group`
                ? // ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                  "https://secure.meetupstatic.com/photos/event/1/4/3/e/600_516605182.webp"
                : group.previewImage
            }
            alt="No group preview"
            className="img-class"
          />
        </div>
        <div className="group-list-text-container">
          <div className="group-name">
            <h2>{group.name}</h2>
            <h3>
              {group.city.toUpperCase()}
              {",  "}
              {group.state}
            </h3>
          </div>
          <p>{group.about}</p>
          <div className="numMembers">
            {group.numMembers} {group.numMembers <= 1 ? "Member" : "Members"} ·{" "}
            {group.private ? "Private" : "Public"}
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupListCard;
