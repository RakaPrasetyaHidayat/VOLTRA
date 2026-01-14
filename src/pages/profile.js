import IconText from "../components/Icon.js";
import "../style/Profile.css";
function Profile() {
    return(
        <>
        <div>
            <IconText />
            <div id="box1">
                <h2 id="title">Create Profile</h2>
                <div id="box2">
                     <img
                    id="profile_icon"
                    src="/Mr_Raka.jpg" 
                    alt="Your Profile"
                    ></img>
                </div>
                <h2 id="username">Username <i className="fa-regular fa-pen-to-square fa-sm"></i></h2>
                <div id="box3">
                    <label for="company">Company</label><br></br>
                    <input type="text" id="company"></input><br></br>
                     <label for="position">Office Position</label><br></br>
                    <input type="text" id="position"></input><br></br>
                     <label for="divison">Division</label><br></br>
                    <input type="text" id="division"></input><br></br>
                     <label for="bio">Bio</label><br></br>
                    <textarea id="bio"></textarea>
                </div>
                <div id="box4">Confirm</div>
            </div>
        </div>
        </>
    )
}



export default Profile;