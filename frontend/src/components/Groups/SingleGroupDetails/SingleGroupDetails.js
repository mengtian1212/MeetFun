import "./SingleGroupDetails.css";
// import "../GroupsList/GroupsList.css";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSingleGroup } from "../../../store/groups";
import LineBreakHelper from "../../../utils/LineBreakHelper";

function SingleGroupDetails() {
  const { groupId } = useParams();
  const targetGroup = useSelector((state) =>
    state.groups.singleGroup ? state.groups.singleGroup : {}
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useEffect thunk ran");
    dispatch(fetchSingleGroup(groupId));
    window.scroll(0, 0);
  }, [dispatch, groupId]);
  if (targetGroup === null) return null;

  let imgUrl = `No preview image for this group`;
  if (Object.keys(targetGroup).length === 0) {
    return null;
  } else {
    const previewImage = targetGroup.GroupImages.find(
      (img) => img.preview === true
    );
    if (previewImage) imgUrl = previewImage.url;
  }

  return (
    <>
      <section className="group-detail-main">
        <div className="group-detail-top">
          <div>
            <NavLink exact to="/groups" className="back-to-groups-container">
              <i className={`fa-solid fa-chevron-left arrow`}></i>{" "}
              <span className="event-or-group selected">Groups</span>
            </NavLink>
          </div>
          <div className="top-container">
            <div className="top-left-img-container">
              <img
                src={
                  imgUrl === `No preview image for this group`
                    ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                    : imgUrl
                }
                alt="No preview for this group"
                className="group-detail-img"
              />
            </div>
            <div className="top-right-text-container">
              <div className="title-and-text">
                <h2>{targetGroup.name}</h2>
                <div className="small-text-container">
                  <div className="detail-container">
                    <div className="icon-container">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      {targetGroup.city}
                      {",  "}
                      {targetGroup.state}
                    </div>
                  </div>
                  <div className="detail-container">
                    <div className="icon-container">
                      <i class="fa-solid fa-user-group"></i>
                    </div>
                    <div>
                      {targetGroup.numMembers}{" "}
                      {targetGroup.numMembers <= 1 ? "Member" : "Members"} ·{" "}
                      {targetGroup.private ? "Private" : "Public"} group
                    </div>
                  </div>
                  <div>
                    <div className="detail-container">
                      <div className="icon-container">
                        <i class="fa-solid fa-user"></i>{" "}
                      </div>
                      <div>
                        Organized by {targetGroup.Organizer.firstName}{" "}
                        {targetGroup.Organizer.lastName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button>Join this group</button>
            </div>
          </div>
        </div>
        <div className="group-detail-bottom">
          <div className="bottom-inner">
            <div className="bottom1-organizer">
              <h2>Organizer</h2>
              <h3>
                {targetGroup.Organizer.firstName}{" "}
                {targetGroup.Organizer.lastName}
              </h3>
            </div>
            <div className="bottom2-what-we-are-about">
              <h2>What we're about</h2>
              <div className="paragraphs">
                <LineBreakHelper text={targetGroup.about} />
              </div>
            </div>
            <div className="upcoming-events-copntainer">
              <h2>Upcoming Events (????)</h2>
              <div>Leave blank card1</div>
            </div>
            <div className="past-events-container">
              <h2>Past Events (????)</h2>
              <div>Leave blank card2</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default SingleGroupDetails;
