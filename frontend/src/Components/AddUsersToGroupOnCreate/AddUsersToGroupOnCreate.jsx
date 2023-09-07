import { useEffect, useRef, useState } from "react";
import "./AddUsersToGroupOnCreate.css";

const AddUsersToGroupOnCreate = ({
  setOnAddUsersToGroup,
  setOnCreateGroup,
  chatsRequests,
  groupName,
  groupImageFile,
  userRequest,
  setChatsList,
  socket
}) => {
  const [dmUsers, setDMUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const usersList = useRef()

  useEffect(() => {
    const as = async () => {
      const data = await chatsRequests.getMyDMUsers();
      setDMUsers(data);
    };
    as().catch(console.error);
  }, [chatsRequests]);

  let tempSelectedUsers;
  let key = 0;

  return (
    <div className="addUsersToGroup">
      <label>Add Members {selectedUsers.length}</label>
      <input
        placeholder="add user"
        style={{ marginBottom: "5px" }}
        onChange={async (event) => {
            let text = event.target.value;

            if (text === "") {
                Array.from(usersList.current.children).forEach(element => {
                    element.classList.remove('hide-user');
                });
            } 
            else {
                Array.from(usersList.current.children).forEach(element => {
                    if (!element.innerText.includes(text)) {
                        element.classList.add('hide-user');
                    }
                    else {
                        element.classList.remove('hide-user');
                    }
                });
            }
        }}
      />

      <div ref={usersList} className="users-list">
        {dmUsers.map((user) => (
          <div
            className="add-user-block"
            key={key++}
            onClick={(event) => {
              event.target.classList.toggle("select-user");

              tempSelectedUsers = [...selectedUsers];
              if (event.target.className.includes("select-user")) {
                tempSelectedUsers.push(user);
              } else {
                tempSelectedUsers.splice(tempSelectedUsers.indexOf(user), 1);
              }
              setSelectedUsers(tempSelectedUsers);
            }}
          >
            <h5>{user.username}</h5>
          </div>
        ))}
      </div>
      
      <button
        className="btn btn-light"
        style={{ fontSize: "15px", margin: "5px" }}
        onClick={() => {
          setOnAddUsersToGroup(false);
        }}
      >
        back
      </button>
      <button
        className="btn btn-light"
        style={{ fontSize: "15px", margin: "5px" }}
        onClick={async () => {
          
          const body = {
              "initialUsers": selectedUsers,
              "groupName": groupName
          }

          const user = await userRequest.getMe();
          body['initialUsers'].push(user);

          let conversation = await chatsRequests.createGroup(body);
          
          if (groupImageFile !== null) {
            await chatsRequests.setGroupImage(conversation.id, groupImageFile);
          }
          
          // in case the user defines an image we request the group with the new image
          setTimeout(async () => {
            conversation = await chatsRequests.getGroup(conversation.id);
            
            setChatsList(prev => [...prev, conversation]);

            socket.emit('newConversation', conversation);

          }, 1000);
          

          setOnAddUsersToGroup(false);
          setOnCreateGroup(false);

        }}
      >
        create
      </button>
    </div>
  );
};

export default AddUsersToGroupOnCreate;
