import { useEffect, useState, useRef } from "react";
import "./ProfileCard.css";

const ProfileCard = ({
  userRequest,
  username,
  setOnCreateGroup,
  setShowStartDM
}) => {
  const inputFile = useRef();
  const image = useRef();

  const fr = new FileReader();

  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    userRequest.initializeImageProfile(setProfileImage);
  }, [userRequest]);

  return (
    <div className="card">
      <h5 className="card-title">{username}</h5>
      <img ref={image} src={profileImage} className="card-img-top" alt="..." />
      <div className="card-body">
        <button
          className="btn btn-dark"
          onClick={() => inputFile.current.click()}
        >
          Upload An Image
        </button>
        <input
          ref={inputFile}
          accept="image/png, image/jpeg, image/jpg"
          type="file"
          style={{ display: "none" }}
          onChange={() => {
            const file = inputFile.current.files[0];

            fr.onload = function () {
              image.current.src = fr.result;
            };
            if (file) {
              fr.readAsDataURL(file);
            }

            userRequest.updateProfileImage(file);
          }}
        />
        <button className="btn btn-success" onClick={() => {
          setShowStartDM(true);
        }}>
          New Chat
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setOnCreateGroup(true);
          }}
        >
          Create A Group
        </button>
      </div>

    </div>
  );
};

export default ProfileCard;
