// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchGroups } from "../../../store/groups";
// import "./GroupList.css";

// import GroupListCard from "./GroupListCard";

// function GroupsList() {
//   const groups = Object.values(
//     useSelector((state) =>
//       state.groups.allGroups ? state.groups.allGroups : []
//     )
//   ).filter((group) => !Array.isArray(group));

//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(fetchGroups());
//   }, [dispatch]);

//   return (
//     <section className="group-event-list-containter">
//       <div id="groups-in-meetfun">Groups in MeetFun</div>
//       {groups.map((group) => (
//         <GroupListCard key={group.id} group={group} />
//       ))}
//     </section>
//   );
// }

// export default GroupsList;
