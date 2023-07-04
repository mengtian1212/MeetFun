import "./GroupsList.css";

function GroupListCard({ group }) {
  return (
    <>
      <div className="group-list-card cursor">
        <div className="group-list-img-container">
          <img
            src={
              group.previewImage === `No preview image for this group`
                ? "No Image Pic"
                : group.previewImage
            }
            alt="placeholder"
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
            {group.numMembers} Members · {group.private ? "Private" : "Public"}
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupListCard;
