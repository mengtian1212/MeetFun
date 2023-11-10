import "./ManageGroup.css";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleGroupThunk } from "../../store/groups";
import { fetchEventsByGroupIdThunk } from "../../store/events";
import { fetchGroupMembersThunk } from "../../store/memberships";
import LoadingPage from "../LoadingPage/LoadingPage";
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteGroupModal from "../Groups/DeleteGroupModal";
import CreateEvent from "../Events/CreateEvent";
import UpdateGroup from "../Groups/UpdateGroup";
import ManageGroupProfile from "./ManageGroupProfile";
import ManageMembers from "./ManageMembers";

function ManageGroup() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [toolTab, setToolTab] = useState("About");

  const sessionUser = useSelector((state) => state.session.user);
  const targetGroup = useSelector((state) => state.groups?.singleGroup);

  const allEvents = useSelector((state) => state.events?.allEvents);
  const groupEvents = allEvents && Object.values(allEvents);

  const members = useSelector((state) => state.memberships.groupMembers);
  const groupMembers = members && Object.values(members);

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

  let imgUrl = `No preview image for this group`;
  if (targetGroup && Object.values(targetGroup).length) {
    const previewImage = targetGroup.GroupImages?.find(
      (img) => img.preview === true
    );
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  useEffect(() => {
    dispatch(fetchSingleGroupThunk(groupId))
      .then(() => dispatch(fetchEventsByGroupIdThunk(groupId)))
      .then(() => dispatch(fetchGroupMembersThunk(groupId)))
      .then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch, groupId]);

  if (isLoading) return <LoadingPage />;

  return (
    <section className="group-detail-main">
      <div className="group-detail-top">
        <NavLink exact to="/dashboard" className="back-to-groups-container">
          <i className={`fa-solid fa-chevron-left arrow`}></i>
          <span className="event-or-group selected">Dashboard</span>
        </NavLink>
        <div className="manage-group-title">Manage {targetGroup.name}</div>
      </div>
      <section className="groups-tabs-container1">
        <div className="bottom-inner1">
          <div
            onClick={() => setToolTab("About")}
            className={`manage-delete-group ${
              toolTab === "About" ? "dash_tab_active" : ""
            }`}
          >
            Group Profile
          </div>
          {/* <div
            onClick={() => setToolTab("Events")}
            className={`dash_tab ${
              toolTab === "Events" ? "dash_tab_active" : ""
            }`}
          >
            Events
          </div> */}
          <div
            onClick={() => setToolTab("members")}
            className={`manage-delete-group ${
              toolTab === "members" ? "dash_tab_active" : ""
            }`}
          >
            Manage Members
          </div>
          <div
            onClick={() => setToolTab("create")}
            className={`manage-delete-group ${
              toolTab === "create" ? "dash_tab_active" : ""
            }`}
          >
            Create Event
          </div>
          <div
            onClick={() => setToolTab("edit")}
            className={`manage-delete-group ${
              toolTab === "edit" ? "dash_tab_active" : ""
            }`}
          >
            Edit Group Info
          </div>
          <div
            onClick={() => setToolTab("delete")}
            className={`manage-delete-group ${
              toolTab === "delete" ? "dash_tab_active" : ""
            }`}
          >
            <OpenModalButton
              modalComponent={<DeleteGroupModal groupId={groupId} />}
              buttonText="Delete Group"
              foreventdelete={`delete-btn ${
                toolTab === "delete" ? "dash_tab_active" : ""
              }`}
            />
          </div>
        </div>
      </section>

      <div className="group-detail-bottom">
        <div className="bottom-inner">
          {(toolTab === "About" || toolTab === "delete") && (
            <ManageGroupProfile />
          )}
          {toolTab === "members" && <ManageMembers targetGroup={targetGroup} />}
          {toolTab === "create" && <CreateEvent />}
          {toolTab === "edit" && <UpdateGroup />}
        </div>
      </div>
    </section>
  );
}

export default ManageGroup;
