import "./SingleGroupDetails.css";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import LineBreakHelper from "../../../utils/LineBreakHelper";

import { fetchSingleGroupThunk } from "../../../store/groups";
import { fetchEventsByGroupIdThunk } from "../../../store/events";
import EventListCard from "../../Events/EventsList/EventListCard";
import {
  capitalizeFirstChar,
  getRandomColor,
  isClickMemberMatchingOtherUserInDM,
} from "../../../utils/helper-functions";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";
import LoadingPage from "../../LoadingPage/LoadingPage";
import {
  addMembershipThunk,
  deleteMembershipThunk,
  fetchGroupMembersThunk,
  fetchGroupMembershipsThunk,
  fetchMyMembershipsThunk,
} from "../../../store/memberships";
import {
  createNewDMThunk,
  fetchAllDirectChatsThunk,
} from "../../../store/directChats";

function SingleGroupDetails() {
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

  const groupImages = targetGroup?.GroupImages;
  const groupImagesSorted = groupImages?.sort((a, b) => {
    return b.preview - a.preview;
  });

  const handleClickJoin = (e) => {
    return dispatch(addMembershipThunk(targetGroup.id));
  };

  const handleClickLeave = (e) => {
    return dispatch(deleteMembershipThunk(myMembership));
  };

  const handleClickCreateEvent = (e) => {
    history.push(`/groups/${groupId}/events/new`);
  };

  const handleClickUpdate = (e) => {
    history.push(`/groups/${groupId}/edit`);
  };

  let organizerBtns = null;
  let joinGroupBtn = null;
  if (
    (sessionUser &&
      targetGroup &&
      Number(sessionUser?.id) === Number(targetGroup.organizerId)) ||
    myMembership?.status === "co-host"
  ) {
    organizerBtns = (
      <div className="organizerbtns-containers">
        <button className="organizerbtns" onClick={handleClickCreateEvent}>
          Create event
        </button>
        <button className="organizerbtns" onClick={handleClickUpdate}>
          Update group
        </button>
        <OpenModalButton
          modalComponent={<DeleteGroupModal groupId={groupId} />}
          buttonText="Delete group"
        // className="organizerbtns"
        // onItemClick={closeMenu}
        />
      </div>
    );
  }

  if (sessionUser && myMembership?.status === "pending") {
    joinGroupBtn = (
      <div className="join-this-group-container">
        <div className="member-s3">
          Your request to join this group is pending
        </div>
        <button onClick={handleClickLeave} className="join-this-group-btn1">
          Withdraw request
        </button>
      </div>
    );
  } else if (
    ((sessionUser && myMembership?.status === "member") ||
      myMembership?.status === "co-host") &&
    Number(sessionUser.id) !== Number(targetGroup.organizerId)
  ) {
    joinGroupBtn = (
      <div className="join-this-group-container">
        <div className="member-s3">You're a {myMembership?.status}</div>
        <button
          onClick={handleClickLeave}
          className="join-this-group-btn1 leave-btn"
        >
          Leave this group
        </button>
      </div>
    );
  } else if (sessionUser && !myMembership) {
    joinGroupBtn = (
      <div className="join-this-group-container">
        <button onClick={handleClickJoin} className="join-this-group-btn">
          Join this group
        </button>
      </div>
    );
  }

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

  if (isLoading) return <LoadingPage />;

  let imgUrl = `No preview image for this group`;
  if (targetGroup && Object.values(targetGroup).length) {
    const previewImage = targetGroup.GroupImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  const handleClickDM = async (attendee) => {
    const directChats = await dispatch(fetchAllDirectChatsThunk());
    console.log("directChats", directChats, attendee.id);
    // if current user already has a dm with this member, then redirect to dm
    const matchedDM = isClickMemberMatchingOtherUserInDM(
      parseInt(attendee.id),
      directChats
    );
    if (attendee.id === sessionUser?.id) return;

    if (matchedDM) {
      window.scroll(0, 0);
      history.push(`/messages/${matchedDM}`);
    } else {
      // otherwise redirect to a new dm page
      console.log("attendee", attendee);
      const directChatId = await dispatch(createNewDMThunk(attendee.id));
      window.scroll(0, 0);
      history.push(`/messages/${directChatId}`);
    }
  };

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
                    ? // ? "https://i0.wp.com/orstx.org/wp-content/uploads/2019/10/no-photo-available-icon-12.jpg?fit=300%2C245&ssl=1"
                    "https://secure.meetupstatic.com/photos/event/1/4/3/e/600_516605182.webp"
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
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      {capitalizeFirstChar(targetGroup.city)}
                      {",  "}
                      {targetGroup.state}
                    </div>
                  </div>
                  <div className="detail-container">
                    <div className="icon-container">
                      <i className="fa-solid fa-user-group"></i>
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
                        <i className="fa-solid fa-user"></i>{" "}
                      </div>
                      <div>
                        Organized by{" "}
                        <span className="organizer-name">
                          {targetGroup?.Organizer?.firstName}{" "}
                          {targetGroup?.Organizer?.lastName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {joinGroupBtn}
              {organizerBtns}
            </div>
          </div>
        </div>
        <div className="group-detail-bottom">
          <div className="bottom-inner">
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
                      <EventListCard
                        key={event.id}
                        event={event}
                        cardMode={true}
                      />
                    ))}
                </div>
              </div>
              {pastEventsArr?.length > 0 && (
                <div className="group-events-container">
                  <h2>Past events ({pastEventsArr?.length})</h2>
                  <div className="list-item">
                    {pastEventsArr?.length > 0 &&
                      pastEventsArr?.map((event) => (
                        <EventListCard
                          key={event.id}
                          event={event}
                          cardMode={true}
                        />
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
                      <div
                        key={member.id}
                        className="member-s"
                        onClick={() => handleClickDM(member)}
                      >
                        {member.picture ? (
                          <img
                            src={member.picture}
                            alt=""
                            className="member-image"
                          />
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
                            {sessionUser?.id !== member.id && (
                              <i className="fa-regular fa-envelope"></i>
                            )}
                          </div>
                        </div>
                        {sessionUser && sessionUser?.id !== member.id && (
                          <div className="chat-mask cursor">
                            <div className="join-this-group-btn5">Chat</div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default SingleGroupDetails;
