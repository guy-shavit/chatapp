import { useEffect, useState } from "react";
import { SERVER_URL } from "../../Websocket/socket.js";
import "./ConversationInfo.css";

const ConversationInfo = ({
  setShowGroupInfo,
  currentConversation,
  chatsRequests,
}) => {
  const [members, setMembers] = useState([]);
  const [ownerUsername, setOwnerUsername] = useState("");

  useEffect(() => {
    const as = async () => {
      const dto = await chatsRequests.getConversationMembers(
        currentConversation.id
      );

      setMembers(dto.members);
      setOwnerUsername(dto.ownerUsername);
    };

    as().catch(console.error);
  }, [currentConversation, chatsRequests]);

  let key = 0;
  return (
    <div className="group-info">
      <div className="wrapper-img">

        <h6 className="conversation-name">{currentConversation.username}</h6>
      </div>



      <div className="group-users-list">
        {members.map((member) => (
          <div className="group-user-block" key={key++}>
            <h6>
              {member.username === ownerUsername
                ? `${member.username} - owner`
                : member.username}
            </h6>
          </div>
        ))}
      </div>

      <button
        className="btn btn-light"
        style={{ fontSize: "15px", marginTop: "5px", marginBottom: "5px" }}
        onClick={() => {
          setShowGroupInfo(false);
        }}
      >
        back
      </button>
    </div>
  );
};

export default ConversationInfo;
