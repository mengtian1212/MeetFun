import "./SingleEventDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import LineBreakHelper from "../../../utils/LineBreakHelper";
import {
  formatDateTime,
  replaceThirdCommaDot,
  capitalizeFirstChar,
} from "../../../utils/helper-functions";

import { fetchSingleEventThunk } from "../../../store/events";
import { fetchSingleGroupThunk } from "../../../store/groups";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteEventModal from "../DeleteEventModal/DeleteEventModal";

function SingleEventDetails() {
  const { eventId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const targetEvent = useSelector((state) =>
    state.events.singleEvent ? state.events.singleEvent : {}
  );
  const targetGroup = useSelector((state) => state.groups.singleGroup);

  const handleClick = () => {
    history.push(`/groups/${targetGroup.id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const event = await dispatch(fetchSingleEventThunk(eventId));
      await dispatch(fetchSingleGroupThunk(event.Group?.id));
      window.scroll(0, 0);
    };
    fetchData();
  }, [dispatch, eventId]);

  let imgUrl = `No preview image for this event`;
  if (Object.keys(targetEvent).length === 0) {
    return (
      <div className="spinner">
        <img
          src="../../image/Spin-1s-118px.gif"
          alt="Loading in progress"
        ></img>
      </div>
    );
  } else {
    const previewImage = targetEvent.EventImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  let imgUrlGroup = `No preview image for this group`;
  if (targetGroup && Object.keys(targetGroup).length > 0) {
    const previewImage = targetGroup.GroupImages.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrlGroup = previewImage.url;
    }
  }

  const handleClickUpdate = (e) => {
    alert("Feature coming soon!");
  };
  let organizerBtns = null;
  if (
    sessionUser &&
    Number(sessionUser.id) === Number(targetGroup?.Organizer?.id)
  ) {
    organizerBtns = (
      <div className="organizerbtns-containers">
        <button className="organizerbtns1" onClick={handleClickUpdate}>
          Update event
        </button>
        <OpenModalButton
          modalComponent={
            <DeleteEventModal eventId={eventId} groupId={targetGroup.id} />
          }
          buttonText="Delete event"
          // className="organizerbtns"
          // onItemClick={closeMenu}
          foreventdelete="foreventdelete"
        />
      </div>
    );
  }

  return (
    <div className="event-whole-container">
      <section className="group-detail-main">
        <div className="group-detail-top">
          <div>
            <NavLink exact to="/events" className="back-to-groups-container">
              <i className={`fa-solid fa-chevron-left arrow`}></i>{" "}
              <span className="event-or-group selected">Events</span>
            </NavLink>
          </div>
          <h2 className="event-title">{targetEvent.name}</h2>
          <h3 className="host">
            <p className="hostby">Hosted By</p>
            <p className="hostname">
              {targetGroup?.Organizer?.firstName}{" "}
              {targetGroup?.Organizer?.lastName}
            </p>
          </h3>
        </div>
      </section>
      <section className="group-detail-main background">
        <div className="group-detail-top background">
          <div className="top-container">
            <div className="top-left-img-container">
              <img
                src={
                  imgUrl === `No preview image for this event`
                    ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                    : imgUrl
                }
                alt="No event preview"
                className="group-detail-img1"
              />
            </div>
            <div className="top-right-text-container">
              <div
                className="small-group-container cursor"
                onClick={handleClick}
              >
                <div className="small-group-img-container">
                  <img
                    src={
                      imgUrlGroup === `No preview image for this group`
                        ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                        : imgUrlGroup
                    }
                    alt="No group preview"
                    className="small-group-img"
                  />
                </div>
                <div className="small-group-text-container">
                  <h2 className="small-group-title">
                    {targetEvent.Group.name}
                  </h2>
                  <div className="small-group-type">
                    {targetGroup?.private ? "Private group" : "Public group"}
                  </div>
                </div>
              </div>
              <div className="event-metadata-container">
                <div className="detail-container">
                  <div className="icon-container">
                    <i className="fa-regular fa-clock"></i>
                  </div>
                  <div>
                    <div>
                      {replaceThirdCommaDot(
                        formatDateTime(targetEvent.startDate)
                      )}{" "}
                      to
                    </div>
                    <div>
                      {replaceThirdCommaDot(
                        formatDateTime(targetEvent.endDate)
                      )}
                    </div>
                  </div>
                </div>
                <div className="detail-container">
                  <div className="icon-container">
                    <i className="fa-solid fa-dollar-sign"></i>
                  </div>
                  <div>
                    {targetEvent.price === "0" || targetEvent.price === 0
                      ? "FREE"
                      : targetEvent.price}
                  </div>
                </div>
                <div className="detail-container">
                  <div className="icon-container">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>{targetEvent.type}</div>
                </div>
                {targetEvent.Venue && (
                  <div className="detail-container">
                    <div className="icon-container">
                      <i className="fa-solid fa-map-pin"></i>
                    </div>
                    <div>
                      {targetEvent.Venue?.address}
                      <div>
                        {Object.keys(targetEvent.Venue).length &&
                          capitalizeFirstChar(targetEvent.Venue?.city)}
                        {",  "}
                        {targetEvent.Venue?.state}
                      </div>
                    </div>
                  </div>
                )}
                {organizerBtns}
              </div>
            </div>
          </div>
        </div>

        <div className="bottom3-what-we-are-about">
          <h2>Details</h2>
          <div className="paragraphs">
            <LineBreakHelper text={targetEvent.description} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SingleEventDetails;
