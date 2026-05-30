import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Profile.module.css";
import defaultAvatar from "../../assets/profil.jpg";
function Profile() {
  const navigate = useNavigate();

  const email =
  localStorage.getItem("userEmail") ||
  sessionStorage.getItem("userEmail");
  const profileKey = email ? `profile_${email}` : null;

  const [isEditingName, setIsEditingName] = useState(false);

  const [form, setForm] = useState({
    username: "",
    avatar: "",
    company: "",
    officePosition: "",
    division: "",
    bio: ""
  });

  useEffect(() => {
    const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

    if (!token || !email || !profileKey) {
      navigate("/login");
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(profileKey));

      if (saved) {
        setForm(saved);
      }
    } catch (err) {
      console.log("Profile parse error:", err);
    }
  }, [navigate, email, profileKey]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://voltra-be.vercel.app/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const result = await res.json();

    if (res.status === 401) {
    alert("Token invalid / expired, silakan login ulang");
    localStorage.removeItem("token");
    navigate("/login");
    return;
    }

    const updated = result.data?.user || form;

    localStorage.setItem(profileKey, JSON.stringify(updated));

    setForm(updated);
    setIsEditingName(false);

    alert("Profile updated!");

    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <IconText />
      <div id={styles.box1}>
        <h2 id={styles.title}>Your Profile</h2>
        <div id={styles.box5}>
          <div id={styles.box2}>
            <div id={styles.icon} onClick={() => {
                  const newAvatar = prompt("Masukkan URL foto profil baru:", form.avatar);
                  if (newAvatar !== null) setForm({ ...form, avatar: newAvatar });
                }}>
              <i 
                className="fa-solid fa-camera" 
                id={styles.edit_icon}
                style={{ cursor: "pointer" }}
              ></i>
              <img 
                id={styles.profile_icon} 
                src={form.avatar || defaultAvatar} 
                alt="Profile" 
                onError={(e) => { e.target.src = defaultAvatar; }} 
              />
            </div>

            <div className={styles.username_wrapper}>
              <h2 id={styles.username}>
                {isEditingName ? (
                  <input
                    className={styles.input_edit_name}
                    value={form.username}
                    name="username"
                    onChange={handleChange}
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                  />
                ) : (
                  <span className={styles.text_truncate}>
                    {form.username || "Username"}
                  </span>
                )}
              </h2>
              {!isEditingName && (
                <i
                  className="fa-regular fa-pen-to-square"
                  id={styles.edit_username}
                  onClick={() => setIsEditingName(true)}
                ></i>
              )}
            </div>
          </div>

          <div id={styles.box3}>
            <label className={styles.label_profile}>Company</label>
            <input
              type="text"
              name="company"
              className={styles.input_profile}
              value={form.company}
              onChange={handleChange}
              placeholder="PT. IT Solusindo"
            />

            <label className={styles.label_profile}>Office Position</label>
            <input
              type="text"
              name="officePosition"
              className={styles.input_profile}
              value={form.officePosition}
              onChange={handleChange}
              placeholder="IT Manager"
            />

            <label className={styles.label_profile}>Division</label>
            <input
              type="text"
              name="division"
              className={styles.input_profile}
              value={form.division}
              onChange={handleChange}
              placeholder="Software Development"
            />

            <label className={styles.label_profile}>Bio</label>
            <textarea
              name="bio"
              id={styles.bio}
              value={form.bio}
              onChange={handleChange}
              placeholder="I'm a senior fullstack website developer."
            ></textarea>

            <div id={styles.box4} onClick={handleUpdate}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;