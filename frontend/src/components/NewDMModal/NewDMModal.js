import "./NewDMModal.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createNewDMThunk, fetchAllUsersThunk } from "../../store/directChats";

function NewDMModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const { closeModal } = useModal();

  const users = useSelector((state) =>
    Object.values(state.directChats.allUsers)
  );

  const [userSearch, setUserSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await dispatch(fetchAllUsersThunk());
      setFilteredUsers(Object.values(res.payload));
    })();
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        return (
          user.firstName.toLowerCase().startsWith(userSearch.toLowerCase()) ||
          user.lastName.toLowerCase().startsWith(userSearch.toLowerCase())
        );
      })
    );
    const filterIds = filteredUsers.map((user) => user.id);
    if (!filterIds.includes(selectedUser)) {
      setSelectedUser(null);
    }
  }, [userSearch]);

  const handleCreateNewDM = async () => {
    const directChatId = await dispatch(createNewDMThunk(selectedUser));
    closeModal();
    history.push(`/messages/${directChatId}`);
  };

  return (
    <div className="new-dm-form__div">
      <div className="new-dm-form__title">Select a user to direct message</div>
      <input
        placeholder="Search for user"
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        className="new-dm-form__input"
      ></input>

      <section className="new-dm-form__user-list">
        {filteredUsers.map((user) => {
          return (
            <div
              key={user.id}
              value={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`new-dm-form__${
                user.id === selectedUser ? "selected" : ""
              }`}
            >
              <img src={user.picture} alt="" className="member-thumb1" />
              {user.firstName}&nbsp;
              {user.lastName}
            </div>
          );
        })}
      </section>

      <button
        onClick={handleCreateNewDM}
        disabled={!selectedUser}
        className="new-dm-form__button"
      >
        Create DM
      </button>
    </div>
  );
}

export default NewDMModal;
