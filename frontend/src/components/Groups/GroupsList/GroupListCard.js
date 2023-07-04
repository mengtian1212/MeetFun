import "./GroupsList.css";

function GroupListItem({ group }) {
  return (
    <>
      <div className="group-list-card cursor">
        <div className="group-list-img-container">
          <img src={group.previewImage} alt="placeholder" />
        </div>
        <div className="group-list-text-container">
          <div id="group-name">
            <h2>{group.name}</h2>
            <h3>
              {group.city.toUpperCase()}
              {",  "}
              {group.state}
            </h3>
          </div>
          <p>{group.about}</p>
          <div id="numMembers">
            {group.numMembers} Members · {group.private ? "Private" : "Public"}
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupListItem;
