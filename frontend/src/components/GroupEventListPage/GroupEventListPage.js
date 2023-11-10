import { NavLink } from "react-router-dom";
import "./GroupEventListPage.css";
import GroupsList from "../Groups/GroupsList";
import EventsList from "../Events/EventsList";

function GroupEventListPage({ showtype }) {
  return (
    <div className="group-event-main">
      <div>
        <div className="event-or-group-container">
          <NavLink exact to="/events" className="event-or-group">
            Events
          </NavLink>
          <NavLink exact to="/groups" className="event-or-group">
            Groups
          </NavLink>
        </div>
        <section className="group-event-list-containter">
          {showtype === "groups" ? <GroupsList /> : <EventsList />}
        </section>
      </div>
    </div>
  );
}

export default GroupEventListPage;
