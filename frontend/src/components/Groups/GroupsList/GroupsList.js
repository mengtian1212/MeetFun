import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupsThunk } from "../../../store/groups";
import "./GroupsList.css";

import GroupListCard from "./GroupListCard";
import LoadingPage from "../../LoadingPage/LoadingPage";

function GroupsList() {
  const [isLoading, setIsLoading] = useState(true);
  const groups = Object.values(
    useSelector((state) =>
      state.groups.allGroups ? state.groups.allGroups : {}
    )
  ).filter((group) => !Array.isArray(group));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGroupsThunk()).then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch]);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <div id="groups-in-meetfun">Groups in MeetFun</div>
      <div className="list-item">
        {groups.map((group) => (
          <GroupListCard key={group.id} group={group} />
        ))}
      </div>
    </>
  );
}

export default GroupsList;
