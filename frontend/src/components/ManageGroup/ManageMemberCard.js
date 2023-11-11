import { formatDateString, getRandomColor } from "../../utils/helper-functions";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMembershipThunk,
  updateMembershipThunk,
} from "../../store/memberships";
import { useParams } from "react-router-dom";

function ManageMemberCard({ member, organizerId }) {
  const { groupId } = useParams();

  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  console.log("mmmm", member, {
    ...member.Membership[0],
    userId: member.id,
    groupId: parseInt(groupId),
  });

  const handleClickLeave = (e) => {
    return dispatch(
      deleteMembershipThunk({
        ...member.Membership[0],
        userId: member.id,
        groupId: parseInt(groupId),
      })
    );
  };

  const updateMemberStatus = (member, status) => {
    const data = {
      memberId: parseInt(member.id),
      status: status,
      groupId: parseInt(groupId),
    };
    console.log("data", data);
    return dispatch(updateMembershipThunk(member, data));
  };

  return (
    <div className={`manage-member-container`}>
      <div className="manage-member-left">
        <div
          className={`member-image`}
          style={{
            backgroundColor: getRandomColor(),
          }}
        >
          {member.Membership[0].status === "Organizer" && (
            <div className="organ-c"></div>
          )}
          {member.Membership[0].status === "co-host" && (
            <div className="host-c"></div>
          )}
          <span>
            {member.firstName[0]}
            {member.lastName[0]}
          </span>
        </div>
        <div className="">
          <div className="member-name">
            {member.firstName}&nbsp;
            {member.lastName}
          </div>
          <div className="member-s2">
            {member.Membership[0].status[0].toUpperCase()}
            {member.Membership[0].status.slice(1)}
          </div>
          <div className="member-s2">
            Joined {formatDateString(member.Membership[0].updatedAt)}
          </div>
        </div>
      </div>

      <div className="member-btns">
        {sessionUser && sessionUser.id === member.id && (
          <div className="youu">You!</div>
        )}
        {sessionUser && sessionUser.id !== member.id && (
          <button className="remove-btn1">
            <i className="fa-solid fa-message"></i>Chat
          </button>
        )}

        {member.Membership[0].status === "co-host" && (
          <>
            {organizerId === sessionUser.id && (
              <button
                className="remove-btn2"
                onClick={() => updateMemberStatus(member, "member")}
              >
                Demote
              </button>
            )}
            {sessionUser.id !== member.id && (
              <button className="remove-btn" onClick={handleClickLeave}>
                Remove from group
              </button>
            )}
          </>
        )}

        {member.Membership[0].status === "member" && (
          <>
            {organizerId === sessionUser.id && (
              <button
                className="remove-btn2"
                onClick={() => updateMemberStatus(member, "co-host")}
              >
                Promote
              </button>
            )}
            <button className="remove-btn" onClick={handleClickLeave}>
              Remove from group
            </button>
          </>
        )}
        {member.Membership[0].status === "pending" && (
          <>
            <button
              className="remove-btn2"
              onClick={() => updateMemberStatus(member, "member")}
            >
              Approve
            </button>
            <button className="remove-btn" onClick={handleClickLeave}>
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ManageMemberCard;
