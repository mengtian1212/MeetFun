import { useParams, useHistory } from "react-router-dom";
import { getRandomColor } from "../../utils/helper-functions";
import EventListCard from "../Events/EventsList/EventListCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchSingleGroupThunk } from "../../store/groups";
import { fetchEventsByGroupIdThunk } from "../../store/events";
import {
  fetchGroupMembersThunk,
  fetchGroupMembershipsThunk,
  fetchMyMembershipsThunk,
} from "../../store/memberships";
import LineBreakHelper from "../../utils/LineBreakHelper";

function ManageGroupProfile() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMoreBtn, setShowReadMoreBtn] = useState(true);
  const contentRef = useRef(null);
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const sessionUser = useSelector((state) => state.session.user);
  const targetGroup = useSelector((state) => state.groups?.singleGroup);

  const allEvents = useSelector((state) => state.events?.allEvents);
  const groupEvents = allEvents && Object.values(allEvents);

  const groupImages = targetGroup?.GroupImages;
  const groupImagesSorted = groupImages?.sort((a, b) => {
    return b.preview - a.preview;
  });

  const members = useSelector((state) => state.memberships.groupMembers);
  const groupMembers = members && Object.values(members);

  const memberships = useSelector(
    (state) => state.memberships.groupMemberships
  );
  const groupMemberships = members && Object.values(memberships);
  const myMembership =
    sessionUser &&
    groupMemberships?.find(
      (membership) => sessionUser.id === membership.userId
    );

  console.log("myMembership", myMembership, groupMemberships);
  const memberStatusOrder = {
    Organizer: 0,
    "co-host": 1,
    member: 2,
    pending: 3,
  };

  const groupMembersSorted = groupMembers.sort((a, b) => {
    const statusA = a.Membership[0].status;
    const statusB = b.Membership[0].status;

    return memberStatusOrder[statusA] - memberStatusOrder[statusB];
  });

  groupMembersSorted?.forEach((member) => {
    if (member.id === targetGroup.organizerId) {
      member.Membership[0].status = "Organizer";
    }
  });

  const upcomingEventsArr = groupEvents?.filter((event) => {
    const startDateTime = new Date(event.startDate).getTime();
    const currDateTime = new Date().getTime();
    return startDateTime > currDateTime;
  });

  upcomingEventsArr?.sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  });

  const pastEventsArr = groupEvents?.filter((event) => {
    const startDateTime = new Date(event.startDate).getTime();
    const currDateTime = new Date().getTime();
    return startDateTime <= currDateTime;
  });

  pastEventsArr?.sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    dispatch(fetchSingleGroupThunk(groupId))
      .then(() => dispatch(fetchEventsByGroupIdThunk(groupId)))
      .then(() => dispatch(fetchGroupMembersThunk(groupId)))
      .then(() => dispatch(fetchGroupMembershipsThunk(groupId)))
      .then(() => {
        if (sessionUser) dispatch(fetchMyMembershipsThunk());
      })
      .then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch, groupId]);

  useEffect(() => {
    if (
      contentRef &&
      contentRef?.current &&
      contentRef.current.scrollHeight <= 100
    ) {
      console.log(contentRef.current.scrollHeight);
      setIsExpanded(true);
      setShowReadMoreBtn(false);
    } else {
      setShowReadMoreBtn(true);
    }
  }, [targetGroup, contentRef.current]);

  let imgUrl = `No preview image for this group`;
  if (targetGroup && Object.values(targetGroup).length) {
    const previewImage = targetGroup.GroupImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  if (isLoading) return null;

  return (
    <div className="bottom-inner2">
      <div className="bottom-inner-left">
        <div className="bottom2-what-we-are-about">
          <h2>What we're about</h2>
          <div
            className={`paragraphs ${isExpanded ? "expanded" : ""}`}
            ref={contentRef}
          >
            <LineBreakHelper text={targetGroup?.about} />
          </div>
          {showReadMoreBtn && (
            <button onClick={toggleDescription} className="read-more">
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
        <div className="group-events-container">
          {(!groupEvents?.length ||
            (groupEvents?.length && !upcomingEventsArr?.length)) && (
            <h2>No Upcoming Events</h2>
          )}
          {upcomingEventsArr?.length > 0 && (
            <h2>Upcoming events ({upcomingEventsArr?.length})</h2>
          )}
          <div className="list-item">
            {upcomingEventsArr?.length > 0 &&
              upcomingEventsArr?.map((event) => (
                <EventListCard key={event.id} event={event} cardMode={true} />
              ))}
          </div>
        </div>
        {pastEventsArr?.length > 0 && (
          <div className="group-events-container">
            <h2>Past events ({pastEventsArr.length})</h2>
            <div className="list-item">
              {pastEventsArr?.length > 0 &&
                pastEventsArr?.map((event) => (
                  <EventListCard key={event.id} event={event} cardMode={true} />
                ))}
            </div>
          </div>
        )}

        <div className="group-events-container">
          {groupImagesSorted?.length > 0 && (
            <h2>Photos ({groupImagesSorted?.length})</h2>
          )}
          <div className="group-img-container">
            {groupImagesSorted?.length > 0 &&
              groupImagesSorted?.map((image) => (
                <img
                  key={image.id}
                  className="group-img-c"
                  src={image.url}
                  alt={image.id}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="bottom-inner-right">
        <div className="bottom1-organizer">
          <h2>Organizer</h2>
          <h3>
            {targetGroup?.Organizer?.firstName}{" "}
            {targetGroup?.Organizer?.lastName}
          </h3>
        </div>
        <div className="group-events-container">
          {groupMembersSorted?.length > 0 && <h2>Members</h2>}
          <div className="group-list-card show-as-white-card1">
            {groupMembersSorted?.length > 0 &&
              groupMembersSorted?.map((member) => (
                <div key={member.id} className="member-s">
                  {member.picture ? (
                    <img src={member.picture} alt="" className="member-image" />
                  ) : (
                    <div
                      className="member-image"
                      style={{
                        backgroundColor: getRandomColor(),
                      }}
                    >
                      <span>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </span>
                    </div>
                  )}

                  <div className="member-s1">
                    <div>
                      {member.firstName}&nbsp;
                      {member.lastName}
                    </div>
                    <div className="member-s2">
                      {member.Membership[0].status[0].toUpperCase()}
                      {member.Membership[0].status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageGroupProfile;
