import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Profile.module.css";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('https://voltra-be.vercel.app/api/auth/profile', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          const user = result.data?.user;
          
          setForm({
            username: user?.username || "",
            avatar: user?.avatar || "/Mr_Raka.jpg",
            company: user?.company || "",
            officePosition: user?.officePosition || "",
            division: user?.division || "",
            bio: user?.bio || ""
          });
        } else if (res.status === 500) {
          console.warn("Profil belum dibuat, silakan isi data baru.");
        }
      } catch (error) {
        console.error("Koneksi gagal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    
    const payload = {};
    if (form.username) payload.username = form.username;
    if (form.avatar) payload.avatar = form.avatar;
    if (form.company) payload.company = form.company;
    if (form.officePosition) payload.officePosition = form.officePosition;
    if (form.division) payload.division = form.division;
    if (form.bio) payload.bio = form.bio;

    try {
      const res = await fetch('https://voltra-be.vercel.app/api/auth/profile', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Server Error 500");
      }

      // --- KODE INSERT MULAI DI SINI ---
      const result = await res.json();
      const user = result.data?.user;

      setForm({
        username: user?.username || "",
        avatar: user?.avatarUrl || "/Mr_Raka.jpg",
        company: user?.company || "",
        officePosition: user?.officePosition || "",
        division: user?.division || "",
        bio: user?.bio || ""
      });

      alert("Profile updated successfully!");
      setIsEditingName(false);
      // --- KODE INSERT SELESAI DI SINI ---

    } catch (err) {
      console.error("Update failed:", err.message);
      alert("Terjadi kesalahan saat update profile");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <IconText />
      <div id={styles.box1}>
        <h2 id={styles.title}>Your Profile</h2>
        <div id={styles.box5}>
          <div id={styles.box2}>
            <div id={styles.icon}>
              <i 
                className="fa-solid fa-camera" 
                id={styles.edit_icon}
                onClick={() => {
                  const newAvatar = prompt("Masukkan URL foto profil baru:", form.avatar);
                  if (newAvatar !== null) setForm({ ...form, avatar: newAvatar });
                }}
                style={{ cursor: "pointer" }}
              ></i>
              <img 
                id={styles.profile_icon} 
                src={form.avatar || "/Mr_Raka.jpg"} 
                alt="Profile" 
                onError={(e) => { e.target.src = "/Mr_Raka.jpg"; }} 
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
                  <span className={styles.text_truncate}>{form.username || "Username"}</span>
                )}
              </h2>
              {!isEditingName && (
                <i className="fa-regular fa-pen-to-square" id={styles.edit_username} onClick={() => setIsEditingName(true)}></i>
              )}
            </div>
          </div>

          <div id={styles.box3}>
            <label className={styles.label_profile}>Company</label>
            <input type="text" name="company" className={styles.input_profile} value={form.company} onChange={handleChange} placeholder="PT. IT Solusindo"/>

            <label className={styles.label_profile}>Office Position</label>
            <input type="text" name="officePosition" className={styles.input_profile} value={form.officePosition} onChange={handleChange} placeholder="IT Manager"/>

            <label className={styles.label_profile}>Division</label>
            <input type="text" name="division" className={styles.input_profile} value={form.division} onChange={handleChange} placeholder="Software Development"/>

            <label className={styles.label_profile}>Bio</label>
            <textarea name="bio" id={styles.bio} value={form.bio} onChange={handleChange} placeholder="I'm a senior fullstack website developer."></textarea>

            <div id={styles.box4} onClick={handleUpdate}>Confirm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;