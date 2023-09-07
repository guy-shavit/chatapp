import { useState, useEffect } from "react";
import "./startDM.css";

const StartDM = ({
  setShowStartDM,
  chatsRequests,
  setCurrentConversation,
  setChatsList,
  setMessages,
  socket
}) => {
  const [usersSearchText, setUsersSearchText] = useState("");
  const [usersSearch, setUsersSeach] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      chatsRequests.setNewUsersBySearch(usersSearchText, setUsersSeach);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [usersSearchText]);

  let key = 0;
  return (
    <div className="start-dm">
      <input
        placeholder="search username"
        onChange={(e) => {
          setUsersSearchText(e.target.value);
        }}
      />
      <div className="users-list">
        {/* from AddUsersToGroupOnCreate.css */}
        {usersSearch.map((user) => (
          <div
            className="add-user-block"
            key={key++}
            onClick={async () => {
              let conversation = await chatsRequests.startDMConversation({
                username: user.username,
              });
                
              chatsRequests.setChatMessagesOnSelect(conversation.id, setMessages);

              setChatsList(prev => [...prev, conversation])
              setCurrentConversation(conversation);
              
              socket.emit('newConversation', conversation);
              
              setShowStartDM(false);
            }}
          >
            <h6>{user.username}</h6>
          </div>
        ))}
      </div>
      <button
        className="btn btn-light"
        style={{ fontSize: "15px", margin: "5px" }}
        onClick={() => {
          setShowStartDM(false);
        }}
      >
        cancel
      </button>
    </div>
  );
};

export default StartDM;
