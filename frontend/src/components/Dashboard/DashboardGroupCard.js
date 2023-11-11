import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function DashboardGroupCard({ groupId, memberType }) {
  const history = useHistory();
  const group = useSelector((state) => state.groups?.allGroups[groupId]);

  return (
    <section
      onClick={
        memberType === "co-host"
          ? () => history.push(`/manage-groups/${groupId}`)
          : () => history.push(`/groups/${groupId}`)
      }
      className="dash-group-container"
    >
      <section className="group-list-img-container1">
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
      </section>

      <section className="dash-group-middle">
        <div className="group-name">
          <h2>{group.name}</h2>
        </div>
        <div className="dash-group-middle1">
          <i className="fa-solid fa-location-dot dash-icon"></i>
          {group.city}
          {",  "}
          {group.state}
        </div>
        <div className="dash-group-middle1">
          <i className="fa-solid fa-user-group dash-icon"></i>
          {group.private ? "Private" : "Public"}
        </div>
      </section>

      <section className="dash-group-nummembers">
        {group.numMembers} {group.numMembers <= 1 ? "Member" : "Members"}
      </section>
    </section>
  );
}

export default DashboardGroupCard;
