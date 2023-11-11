import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchGroupsThunk } from "../../store/groups";
import DashboardGroupCard from "./DashboardGroupCard";
import LoadingPage from "../LoadingPage/LoadingPage";

function DashboardGroups({ myMemberships }) {
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [memberType, setMemberType] = useState("co-host");
  const myMembershipsArr = Object.values(myMemberships);
  const organizerMemberships = myMembershipsArr.filter(
    (membership) => membership.status === "co-host"
  );
  const memberMemberships = myMembershipsArr.filter(
    (membership) => membership.status === "member"
  );
  const pendingMemberships = myMembershipsArr.filter(
    (membership) => membership.status === "pending"
  );

  console.log(
    "myMembershipsArr",
    myMembershipsArr,
    organizerMemberships,
    memberMemberships,
    pendingMemberships
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGroupsThunk()).then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch]);

  if (isLoading) return <LoadingPage />;
  return (
    <main className="dash-group-main">
      <h2 className="dash-my-groups">My Groups</h2>
      <section className="groups-tabs-container">
        <div
          onClick={() => setMemberType("co-host")}
          className={`dash_tab ${
            memberType === "co-host" ? "dash_tab_active" : ""
          }`}
        >
          Organizer
        </div>
        <div
          onClick={() => setMemberType("member")}
          className={`dash_tab ${
            memberType === "member" ? "dash_tab_active" : ""
          }`}
        >
          Member
        </div>
        <div
          onClick={() => setMemberType("pending")}
          className={`dash_tab ${
            memberType === "pending" ? "dash_tab_active" : ""
          }`}
        >
          Pending
        </div>
      </section>
      <section>
        {memberType === "co-host" && (
          <div className="dash-group-single">
            {organizerMemberships.length ? (
              organizerMemberships.map((membership) => (
                <DashboardGroupCard
                  key={membership.id}
                  groupId={membership.groupId}
                  memberType={memberType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <div>
                  <img
                    src="https://secure.meetupstatic.com/next/images/home/Add.svg"
                    alt=""
                  />
                </div>
                <div className="no-join">
                  You have not created any groups yet
                </div>
                <button
                  onClick={
                    sessionUser
                      ? () => history.push("/groups/new")
                      : () => history.push("/")
                  }
                  className="search-btn"
                >
                  Start a Group
                </button>
              </div>
            )}
          </div>
        )}

        {memberType === "member" && (
          <div className="dash-group-single">
            {memberMemberships.length ? (
              memberMemberships.map((membership) => (
                <DashboardGroupCard
                  key={membership.id}
                  groupId={membership.groupId}
                  memberType={memberType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <div>
                  <img
                    src="https://secure.meetupstatic.com/next/images/home/Add.svg"
                    alt=""
                  />
                </div>
                <div className="no-join">
                  You have not joined any groups yet
                </div>
                <button
                  onClick={() => history.push("/groups")}
                  className="search-btn"
                >
                  Search Groups
                </button>
              </div>
            )}
          </div>
        )}

        {memberType === "pending" && (
          <div className="dash-group-single">
            {pendingMemberships.length ? (
              pendingMemberships.map((membership) => (
                <DashboardGroupCard
                  key={membership.id}
                  groupId={membership.groupId}
                  memberType={memberType}
                />
              ))
            ) : (
              <div className="no-my-groups">
                <div>
                  <img
                    src="https://secure.meetupstatic.com/next/images/home/Add.svg"
                    alt=""
                  />
                </div>
                <div className="no-join">
                  You don't have any pending requests
                </div>
                <button
                  onClick={() => history.push("/groups")}
                  className="search-btn"
                >
                  Search Groups
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardGroups;
