import "./ChatsList.css";
import { SERVER_URL } from "../../Websocket/socket.js";


const ChatsList = ({
  chats,
  chatsRequests,
  setCurrentConversation,
  setMessages,
}) => {
  let key = 0;
  return (
    <div className="chats-list">
      {chats.map((chat) => (
        <div
          className="chat-block"
          key={key++}
          onClick={async () => {
            const group = await chatsRequests.getGroup(chat.id);

            await chatsRequests.setChatMessagesOnSelect(
              group.id,
              setMessages
            );

            setCurrentConversation(group);
          }

        }
        >
          <div className="wrapper">
            <img
              src={`${SERVER_URL}/${chat.profile_image}`}
              alt={`${SERVER_URL}/default.jpg`}
            />
            <h3>{chat.username}</h3>
            <h6
              style={{ color: chat.chatType === "dm" ? "greenyellow" : "red" }}
            >
              {chat.chatType}
            </h6>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatsList;
