import IconText from "../../components/Icon/Icon.js";
import "./Profile.module.css";
function Profile() {
    return(
      <div className="container">
            <IconText />
            <div id="box1">
                <h2 id="title">Create Profile</h2>
                
                <div id="box5">
                <div id="box2">
                <div id="icon">
                     <img
                    id="profile_icon"
                    src="/Mr_Raka.jpg" 
                    alt="Your Profile"
                    ></img>
                </div>
               
                 <h2 id="username">Username <i className="fa-regular fa-pen-to-square fa-sm"></i></h2>
                 </div>
                <div id="box3">
                    <label for="company" className="label_profile">Company</label><br></br>
                    <input type="text" id="company" className="input_profile"></input><br></br>
                     <label for="position" className="label_profile">Office Position</label><br></br>
                    <input type="text" id="position" className="input_profile"></input><br></br>
                     <label for="divison" className="label_profile">Division</label><br></br>
                    <input type="text" id="division" className="input_profile"></input><br></br>
                     <label for="bio" className="label_profile">Bio</label><br></br>
                    <textarea id="bio"></textarea>
                     <div id="box4">Confirm</div>
                </div>
               </div>
            </div>
            </div>
    )
}



export default Profile;