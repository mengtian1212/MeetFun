import { useEffect, useState } from "react";
import {
  fetchGroupMembersThunk,
  fetchGroupMembershipsThunk,
  fetchMyMembershipsThunk,
} from "../../store/memberships";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import "./ManageMembers.css";
import ManageMemberCard from "./ManageMemberCard";

function ManageMembers({ targetGroup }) {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(true);

  const members = useSelector((state) => state.memberships.groupMembers);
  let groupMembersAll = members && Object.values(members);

  // leadership team
  const leadership = groupMembersAll.filter(
    (m) =>
      m.Membership[0].status === "co-host" || m.id === targetGroup.organizerId
  );

  const memberStatusOrder = {
    Organizer: 0,
    "co-host": 1,
    member: 2,
    pending: 3,
  };
  const leadershipSorted = leadership.sort((a, b) => {
    const statusA = a.Membership[0].status;
    const statusB = b.Membership[0].status;

    return memberStatusOrder[statusA] - memberStatusOrder[statusB];
  });

  leadershipSorted?.forEach((member) => {
    if (member.id === targetGroup.organizerId) {
      member.Membership[0].status = "Organizer";
    }
  });

  // members
  const groupMembers = groupMembersAll.filter(
    (m) => m.Membership[0].status === "member"
  );

  // pending requests
  const pendingMembers = groupMembersAll.filter(
    (m) => m.Membership[0].status === "pending"
  );

  useEffect(() => {
    dispatch(fetchGroupMembersThunk(groupId))
      .then(() => dispatch(fetchGroupMembershipsThunk(groupId)))
      .then(() => {
        if (sessionUser) dispatch(fetchMyMembershipsThunk());
      })
      .then(() => setIsLoading(false));
    window.scroll(0, 0);
  }, [dispatch, groupId]);

  if (isLoading) return null;

  return (
    <div className="manage-member-out">
      {leadershipSorted?.length > 0 && (
        <section>
          <h2 className="member-title">
            Leadership Team ({leadershipSorted?.length})
          </h2>
          <section className="manage-member-single">
            {leadershipSorted?.length > 0 &&
              leadershipSorted?.map((member) => (
                <ManageMemberCard
                  key={member.id}
                  member={member}
                  organizerId={targetGroup.organizerId}
                />
              ))}
          </section>
        </section>
      )}

      <section>
        <h2 className="member-title">Members ({groupMembers?.length})</h2>
        {groupMembers?.length > 0 ? (
          <section className="group-list-card show-as-white-card1">
            {groupMembers?.length > 0 &&
              groupMembers?.map((member) => (
                <ManageMemberCard
                  key={member.id}
                  member={member}
                  organizerId={targetGroup.organizerId}
                />
              ))}
          </section>
        ) : (
          <div>No members found</div>
        )}
      </section>

      <section>
        <h2 className="member-title">
          Pending Requests ({pendingMembers?.length})
        </h2>
        {pendingMembers?.length > 0 ? (
          <section className="group-list-card show-as-white-card1">
            {pendingMembers?.length > 0 &&
              pendingMembers?.map((member) => (
                <ManageMemberCard
                  key={member.id}
                  member={member}
                  organizerId={targetGroup.organizerId}
                />
              ))}
          </section>
        ) : (
          <div>No pending requests</div>
        )}
      </section>
    </div>
  );
}

export default ManageMembers;
