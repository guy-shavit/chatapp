import "./Chats.css";
import ChatsRequests from "../../Services/chats.service";
import UserRequests from "../../Services/user.service";
import { socket, SERVER_URL } from "../../Websocket/socket.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ConversationInfo from "../ConversationInfo/ConversationInfo";
import ChatsList from "../ChatsList/ChatsList";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import ChatMessages from "../ChatMessages/ChatMessages";
import CreateGroup from "../CreateGroup/CreateGroup";
import StartDM from "../StartDM/startDM";

const chatsRequests = new ChatsRequests(SERVER_URL);
const userRequest = new UserRequests(SERVER_URL);

const Chats = ({ routeNavigator }) => {
  const location = useLocation();

  const chatsSearchInput = useRef();
  const page = useRef();

  const [messages, setMessages] = useState([]);
  const [chatsList, setChatsList] = useState([]);
  const [onCreateGroup, setOnCreateGroup] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showStartDM, setShowStartDM] = useState(false);

  const [chatSearchText, setChatSearchTest] = useState('');

  useEffect(() => {
    page.current.classList.toggle("set-blur");
  }, [onCreateGroup, showGroupInfo, page, showStartDM]);

  // ------------
  const messageListener = useCallback((msg) => {
    if (currentConversation === null) {
      return;
    }
    if (currentConversation.id === msg.conversationId) {
      setMessages((prev) => [...prev, msg]);
    }
  }, [currentConversation]);

  useEffect(() => {
    socket.on("onMessage", messageListener);
    return () => {
      socket.off("onMessage", messageListener);
    };
  }, [messageListener]);
  // -------------

  const newConversationListener = useCallback( (conv) => {
    console.log(conv);
    if (!chatsList.includes(conv)) {
      setChatsList((prev) => [conv, ...prev]);
    }
  }, [chatsList]);

  useEffect(() => {
    socket.on("onNewConversation", newConversationListener);
    return () => {
      socket.off("onNewConversation", newConversationListener);
    };
  }, [newConversationListener]);
  // -------------

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (chatSearchText === "") {
        chatsRequests.setChatsOnLoad(setChatsList);
      } else {
        chatsRequests.setChatsSearch(chatSearchText, setChatsList);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [chatSearchText])

  useEffect(() => {
    if (location.state === null) {
      return routeNavigator("/");
    }
    chatsRequests.setBearerToken(location.state.bearerToken);
    userRequest.setBearerToken(location.state.bearerToken);

    page.current.classList.toggle("set-blur");
    chatsRequests.setChatsOnLoad(setChatsList);

    socket.on("connect", () => {
      socket.emit("register", {
        username: location.state.username,
        socketId: socket.id,
      });
      console.log("connected");
    });
    
    socket.connect();

    return () => {
      console.log("disconnect");
      socket.off("connect");
      socket.disconnect();
    };
  }, [location.state, routeNavigator]);

  return (
    <>
      <div ref={page} className="chat-page">
        <div className="chats">
          {location.state && userRequest.bearerToken && (
            <ProfileMenu
              userRequest={userRequest}
              username={location.state.username}
              setOnCreateGroup={setOnCreateGroup}
              setShowStartDM={setShowStartDM}
            />
          )}
          <input
            ref={chatsSearchInput}
            placeholder="search"
            onChange={() => {
              const search = chatsSearchInput.current.value;
              setChatSearchTest(search);
            }}
          />
          <ChatsList
            chats={chatsList}
            chatsRequests={chatsRequests}
            currentConversation={currentConversation}
            setCurrentConversation={setCurrentConversation}
            setMessages={setMessages}
          />
        </div>
        <div className="chat-messages">
          {currentConversation !== null && (
            <ChatMessages
              messages={messages}
              setMessages={setMessages}
              chatsRequests={chatsRequests}
              currentConversation={currentConversation}
              ownerUsername={location.state.username}
              socket={socket}
              setShowGroupInfo={setShowGroupInfo}
            />
          )}
        </div>
      </div>
      {showGroupInfo && (
        <ConversationInfo
          setShowGroupInfo={setShowGroupInfo}
          currentConversation={currentConversation}
          chatsRequests={chatsRequests}
        />
      )}
      {onCreateGroup && (
        <CreateGroup
          setOnCreateGroup={setOnCreateGroup}
          chatsRequests={chatsRequests}
          userRequest={userRequest}
          setChatsList={setChatsList}
          socket={socket}
        />
      )}
      {
        showStartDM &&
        <StartDM 
          setShowStartDM={setShowStartDM}
          chatsRequests={chatsRequests}
          setCurrentConversation={setCurrentConversation}
          setChatsList={setChatsList}
          setMessages={setMessages}
          socket={socket}
        />
      }
    </>
  );
};

export default Chats;
