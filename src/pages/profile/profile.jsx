import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Profile.module.css";
function Profile() {
    return(
    <div className={styles.container}>
            <IconText />
            <div id={styles.box1}>
                <h2 id={styles.title}>Create Profile</h2>
                
                <div id={styles.box5}>
                <div id={styles.box2}>
                <div id={styles.icon}>
                  <i class="fa-solid fa-camera" id={styles.edit_icon}></i>
                     <img
                    id={styles.profile_icon}
                    src="/Mr_Raka.jpg" 
                    alt="Your Profile"
                    ></img>
                </div>
                 <h2 id={styles.username}>Username <i className="fa-regular fa-pen-to-square" id={styles.edit_username}></i></h2>
                 </div>
                <div id={styles.box3}>
                    <label for="company" className={styles.label_profile}>Company</label><br></br>
                    <input type="text" id="company" className={styles.input_profile} placeholder="PT. IT SOLUSINDO"></input><br></br>
                     <label for="position" className={styles.label_profile}>Office Position</label><br></br>
                    <input type="text" id="position" className={styles.input_profile} placeholder="IT Manager"></input><br></br>
                     <label for="divison" className={styles.label_profile}>Division</label><br></br>
                    <input type="text" id="division" className={styles.input_profile} placeholder="IT Security/Cybersecurity"></input><br></br>
                     <label for="bio" className={styles.label_profile}>Bio</label><br></br>
                    <textarea id={styles.bio} placeholder="Efficiency is the key to finish everything faster."></textarea>
                     <div id={styles.box4}>Confirm</div>
                </div>
               </div>
            </div>
    </div>
    )
}



export default Profile;