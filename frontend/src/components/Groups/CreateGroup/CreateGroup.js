import "./CreateGroup.css";
import GroupForm from "../GroupForm/GroupForm";

function CreateGroup() {
  const group = {
    city: "",
    state: "",
    name: "",
    about: "",
    type: "",
    privateStatus: "",
    imageUrl: "",
  };

  return <GroupForm group={group} formType="Create Group" />;
}

export default CreateGroup;
