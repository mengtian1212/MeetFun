import "./Dashboard.css";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { fetchMyMembershipsThunk } from "../../store/memberships";
import { fetchMyAttendancesThunk } from "../../store/attendances";
import LoadingPage from "../LoadingPage/LoadingPage";
import DashboardGroups from "./DashboardGroups";
import DashboardEvents from "./DashboardEvents";

function Dashboard() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const sessionUser = useSelector((state) => state.session.user);
  const myMemberships = useSelector((state) => state.memberships.myMemberships);
  const myAttendances = useSelector((state) => state.attendances.myAttendances);

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchMyMembershipsThunk())
        .then(() => dispatch(fetchMyAttendancesThunk()))
        .then(() => setIsLoading(false));
      window.scroll(0, 0);
    }
  }, [dispatch]);

  if (!sessionUser) return <Redirect to="/" />;
  if (isLoading) return <LoadingPage />;

  return (
    <main className="dash-container">
      <section className="dash-inner">
        <header className="dash-welcome">
          Welcome, {sessionUser.firstName}👋
        </header>
        <DashboardGroups myMemberships={myMemberships} />
        <DashboardEvents myAttendances={myAttendances} />
      </section>
    </main>
  );
}

export default Dashboard;
