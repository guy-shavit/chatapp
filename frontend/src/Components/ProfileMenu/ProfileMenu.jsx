import { useRef } from "react";
import "./ProfileMenu.css";
import ProfileCard from "../ProfileCard/ProfileCard";

const ProfileMenu = ({ userRequest, username, setOnCreateGroup, setShowStartDM }) => {
  const openMenuBtn = useRef();
  const menuNavBar = useRef();

  const onMenuBtnClicked = () => {
    openMenuBtn.current.classList.toggle("activate");
    menuNavBar.current.classList.toggle("open");
  };
  return (
    <div>
      <div
        ref={openMenuBtn}
        className="menu-btn"
        onClick={onMenuBtnClicked}
      >
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div ref={menuNavBar} className="menu-nav">
        <ProfileCard
          userRequest={userRequest}
          username={username}
          setOnCreateGroup={setOnCreateGroup}
          setShowStartDM={setShowStartDM}
        />
      </div>
    </div>
  );
};

export default ProfileMenu;
