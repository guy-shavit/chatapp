import "./CreateGroup.css";
import AddUsersToGroupOnCreate from "../AddUsersToGroupOnCreate/AddUsersToGroupOnCreate";
import SetGroupSettingsOnCreate from "../SetGroupSettingsOnCreate/SetGroupSettingsOnCreate";
import { useState } from "react";

const CreateGroup = ({
  setOnCreateGroup,
  chatsRequests,
  userRequest,
  setChatsList,
  socket
}) => {
  const [groupImageFile, setGroupImageFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [onAddUsersToGroup, setOnAddUsersToGroup] = useState(false);

  return (
    <div className="createGroup">
      {!onAddUsersToGroup && (
        <SetGroupSettingsOnCreate
          setGroupImageFile={setGroupImageFile}
          setOnCreateGroup={setOnCreateGroup}
          setOnAddUsersToGroup={setOnAddUsersToGroup}
          setGroupName={setGroupName}
          groupImageFile={groupImageFile}
          groupName={groupName}
        />
      )}
      {onAddUsersToGroup && (
        <AddUsersToGroupOnCreate
          setOnAddUsersToGroup={setOnAddUsersToGroup}
          setOnCreateGroup={setOnCreateGroup}
          chatsRequests={chatsRequests}
          groupName={groupName}
          groupImageFile={groupImageFile}
          userRequest={userRequest}
          setChatsList={setChatsList}
          socket={socket}
        />
      )}
    </div>
  );
};

export default CreateGroup;
