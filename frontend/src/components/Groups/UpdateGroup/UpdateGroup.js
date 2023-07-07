import "./UpdateGroup.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GroupForm from "../GroupForm/GroupForm";
import { fetchSingleGroupThunk } from "../../../store/groups";

function UpdateGroup() {
  const { groupId } = useParams();
  const group = useSelector((state) =>
    state.groups.singleGroup ? state.groups.singleGroup : null
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleGroupThunk(Number(groupId)));
    window.scroll(0, 0);
  }, [dispatch, groupId]);

  let imgUrl = ``;
  if (!group || (group && !Object.values(group).length)) {
    return null;
  } else {
    const previewImage = group.GroupImages?.find((img) => img.preview === true);
    if (previewImage && Object.keys(previewImage).length > 0) {
      imgUrl = previewImage.url;
    }
  }

  let passGroupProp = { ...group };
  if (imgUrl) passGroupProp = { ...group, imgUrl, preview: true };
  console.log(passGroupProp);
  console.log("where is group", passGroupProp);
  return <GroupForm group={passGroupProp} formType="Update Group" />;
}

export default UpdateGroup;
