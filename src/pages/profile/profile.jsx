import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Profile.module.css";
import { useState, useEffect } from "react";

function Profile() {

  const token = localStorage.getItem("token");

  // STATE PROFILE
  const [profile, setProfile] = useState({
    username: "",
    company: "",
    position: "",
    division: "",
    bio: "",
    avatar: ""
  });

  // FETCH PROFILE (AUTO LOAD PAGE)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://voltra-be.vercel.app/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.log("Failed load profile", err);
      }
    };

    fetchProfile();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.id]: e.target.value
    });
  };

  // EDIT USERNAME VIA ICON
  const editUsername = () => {
    const newName = prompt("Enter new username:");
    if (!newName) return;

    setProfile({
      ...profile,
      username: newName
    });
  };

  // UPDATE PROFILE API
  const updateProfile = async () => {
    try {
      const res = await fetch(
        "https://voltra-be.vercel.app/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(profile)
        }
      );

      await res.json();
      alert("Profile updated successfully 🚀");
    } catch (err) {
      console.log(err);
      alert("Failed update profile");
    }
  };

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
