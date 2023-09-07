import { useEffect, useRef } from "react";
import { SERVER_URL } from "../../Websocket/socket.js";
import "./SetGroupSettingsOnCreate.css";

const SetGroupSettingsOnCreate = ({
  setGroupImageFile,
  setOnCreateGroup,
  setOnAddUsersToGroup,
  setGroupName,
  groupImageFile,
  groupName
}) => {
  const inputFile = useRef();
  const inputGroupName = useRef();
  const image = useRef();
  
  useEffect(() => {
    const fr = new FileReader()
    // if pressed the cancel button on the screen where adding users to group (before the create group button)
    if (groupImageFile === null) {
        image.current.src = `${SERVER_URL}/default.jpg`
    } 
    else {
        fr.onload = () => {
            image.current.src = fr.result;
        };
        fr.readAsDataURL(groupImageFile);
    }
    inputGroupName.current.value = groupName;
  }, [groupName, groupImageFile]); // cant add groupImageFile because when setting group image the readAsDataURL funtion is called twice and there is a conflict

  return (
    <div>
    <div className="create-group-profile-card">
      <div className="card">
        <img
          ref={image}
          className="card-img-top"
          alt="..."
        />

          <div className="card-body">
            <button
              className="btn btn-dark"
              style={{ marginTop: "0px" }}
              onClick={() => inputFile.current.click()}
              >
              set image
            </button>
            <input
              ref={inputFile}
              accept="image/png, image/jpeg, image/jpg"
              type="file"
              style={{ display: "none" }}
              onChange={() => {
                let file = inputFile.current.files[0];
                
                if (file) {
                  setGroupImageFile(file);
                }
              }}
              />
          </div>
      </div>
      </div>
      <div className="set-group-name">
        <label>group name:</label>
        <input 
         ref={inputGroupName}
         id="groupName"
         onChange={(event) => {
            setGroupName(event.target.value);
        }} />
      </div>

      <div>
        <button
          className="btn btn-light"
          style={{ fontSize: "15px", margin: "5px" }}
          onClick={() => {
            setOnCreateGroup(false);
          }}
        >
          cancel
        </button>
        <button
          className="btn btn-light"
          style={{ fontSize: "15px", margin: "5px" }}
          onClick={() => {
            setOnAddUsersToGroup(true);
          }}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default SetGroupSettingsOnCreate;
