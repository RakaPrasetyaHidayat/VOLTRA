import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Profile.module.css";
import { useState, useEffect } from "react";

function Profile() {
  return(
    <div className={styles.container}>
      <IconText />

      <div id={styles.box1}>
        <h2 id={styles.title}>Create Profile</h2>
        
        <div id={styles.box5}>
          
          <div id={styles.box2}>
            <div id={styles.icon}>
              <i className="fa-solid fa-camera" id={styles.edit_icon}></i>

              <img
                id={styles.profile_icon}
                src={profile.avatar || "/Mr_Raka.jpg"}
                alt="Your Profile"
              />
            </div>
           <h2 id={styles.username}>Username <i className="fa-regular fa-pen-to-square" id={styles.edit_username}></i></h2>
          </div>

          <div id={styles.box3}>
            <label htmlFor="company" className={styles.label_profile}>Company</label><br/>
            <input
              type="text"
              id="company"
              className={styles.input_profile}
              placeholder="PT IT SOLUSINDO"
              value={profile.company || ""}
              onChange={handleChange}
            /><br/>

            <label htmlFor="position" className={styles.label_profile}>Office Position</label><br/>
            <input
              type="text"
              id="position"
              className={styles.input_profile}
              placeholder="IT Manager"
              value={profile.position || ""}
              onChange={handleChange}
            /><br/>

            <label htmlFor="division" className={styles.label_profile}>Division</label><br/>
            <input
              type="text"
              id="division"
              className={styles.input_profile}
              placeholder="IT Security/Cybersecurity"
              value={profile.division || ""}
              onChange={handleChange}
            /><br/>

            <label htmlFor="bio" className={styles.label_profile}>Bio</label><br/>
            <textarea
              id={styles.bio}
              placeholder="Efficiency is the key to finish everything faster."
              value={profile.bio || ""}
              onChange={handleChange}
            ></textarea>

            <div id={styles.box4} onClick={updateProfile}>
              Confirm
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
