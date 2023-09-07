import { useEffect, useRef } from "react";
import "./ChatMessages.css";

const ChatMessages = ({
  messages,
  setMessages,
  chatsRequests,
  currentConversation,
  ownerUsername,
  socket,
  setShowGroupInfo
}) => {
  const messageInputBox = useRef();
  const messagesBlock = useRef();

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    // when user sends a message the messages window will be scrolled to the latest message
    messagesBlock.current.scrollTo(0, messagesBlock.current.scrollHeight + 100);
  }, [messages]);

  async function sendMessage() {
    let text = messageInputBox.current.value;
    if (text === "") {
      return;
    }
    let body = {
      message: text,
      conversationId: currentConversation.id,
    };
    let msg = await chatsRequests.storeMessage(body, setMessages);
    socket.emit("newMessage", msg);

    messageInputBox.current.value = "";
  }

  let key = 0;
  return (
    <>
      <button
        id="showGroupInfo"
        className="btn btn-light"
        data-mdb-ripple-color="dark"
        style={{
          marginTop: "5px",
          cursor: "pointer",
          width: "65vw",
        }}
        onClick={() => {
          setShowGroupInfo(true);
        }}
      >
        {currentConversation.chatType === "dm"
          ? currentConversation.username.replace(ownerUsername, "")
          : currentConversation.username}
        - ({currentConversation.chatType})
      </button>

      <div ref={messagesBlock} id="messages">
        {messages.map((msg) => (
          <div
            className="msg"
            key={key++}
            style={{
              float: msg.from_user === ownerUsername ? "left" : "right",
              backgroundColor:
                msg.from_user === ownerUsername ? "yellow" : "white",
            }}
          >
            <ul>
              {msg.from_user !== ownerUsername &&
                currentConversation.chatType === "group" && (
                  <li name="username">
                    <u>{msg.from_user}</u>
                  </li>
                )}
              <li name="text">{msg.text}</li>
              <li name="date">
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className="container">
        <input
          ref={messageInputBox}
          id="messageBox"
          type="text"
          placeholder="message"
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              await sendMessage();
            }
          }}
        />
        <img
          id="send"
          src="sendMessage.png"
          alt="..."
          style={{borderStyle: "none"}}
          onClick={async () => await sendMessage()}
        />
      </div>
      
    </>
  );
};

export default ChatMessages;
