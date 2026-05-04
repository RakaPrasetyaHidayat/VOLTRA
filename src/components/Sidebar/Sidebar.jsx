import IconText from "../../components/Icon/Icon1.jsx";
import plus from "../../assets/plus.svg";
import setting from "../../assets/setting.svg";
import icon from "../../assets/icon.svg";
import search from "../../assets/search.svg";
import home from "../../assets/home.svg";
import task from "../../assets/task.svg";
import notes from "../../assets/notes.svg";
import notif from "../../assets/notification.svg";
import exit from "../../assets/exit.svg";
import styles from "./Sidebar.module.css";
import { useTab } from "../../components/Tab/TabContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"; // Tambahkan useState

function Sidebar() {
    const { addTab } = useTab();
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- State Baru untuk Join Team ---
    const [showJoinPopup, setShowJoinPopup] = useState(false);
    const [teamIdInput, setTeamIdInput] = useState("");
    // Tambahkan state untuk Exit Team
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [exitTeamId, setExitTeamId] = useState("");

    // Fungsi Logika Exit Team
    const handleExitTeam = async () => {
        if (!exitTeamId) {
            alert("Harap masukkan ID Team yang ingin ditinggalkan!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            // Menggunakan metode DELETE untuk exit/leave
            const response = await fetch(`https://voltra-be.vercel.app/api/teams/${exitTeamId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Berhasil keluar dari tim!");
                setShowExitPopup(false);
                setExitTeamId("");
            } else {
                const errorData = await response.json();
                alert(`Gagal: ${errorData.message || "Terjadi kesalahan"}`);
            }
        } catch (error) {
            console.error("Exit Team Error:", error);
            alert("Gagal menghubungi server.");
        }
    };
    const isActive = (path) => location.pathname === path;
    
    const openPage = (name, icon, path) => {
        addTab(name, icon);
        navigate(path);
    };

    // --- Fungsi Logika Join Team ---
    const handleJoinTeam = async () => {
        if (!teamIdInput) {
            alert("Harap masukkan ID Team!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://voltra-be.vercel.app/api/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ teamId: teamIdInput }), // Sesuaikan key JSON dengan kebutuhan BE
            });

            if (response.ok) {
                alert("Berhasil bergabung dengan tim!");
                setShowJoinPopup(false);
                setTeamIdInput("");
            } else {
                const errorData = await response.json();
                alert(`Gagal: ${errorData.message || "Terjadi kesalahan"}`);
            }
        } catch (error) {
            console.error("Join Team Error:", error);
            alert("Gagal menghubungi server.");
        }
    };

    return (
        <div id={styles.sidebar}>
            <div id={styles.sidebarTop}>
                <IconText />
                <nav>
                    <ul>
                        <li><img src={search} alt="Search" style={{ width: "25px"}} />Search</li>
                        <li onClick={() => openPage("Home", home, "/home")} className={`${styles.item} ${isActive("/home") ? styles.active : ""}`}><img src={home} alt="Home" style={{ width: "25px" }} />Home</li>
                         <li onClick={() => openPage("Notes", notes, "/note")} className={`${styles.item} ${isActive("/note") ? styles.active : ""}`}><img src={notes} alt="Notes" style={{ width: "25px" }} />Notes</li>
                        <li onClick={() => openPage("Task", task, "/task")} className={`${styles.item} ${isActive("/task") ? styles.active : ""}`}><img src={task} alt="Task" style={{ width: "25px" }} />Task</li>
                    </ul>
                </nav>
            </div>
           
            <div id={styles.sidebarMain}>
                <ul>
                    <li>Private</li>
                    <li><span><img src={plus} alt="Create Team" style={{ width: "25px" }} />Create New</span></li>
                    
                    <li>Team</li>
                    <li className={styles.teamActions}>
                        <span onClick={() => setShowJoinPopup(true)} className={styles.actionBtn}>
                            <img src={plus} alt="Join Team" style={{ width: "25px" }} />Join Team
                        </span>
                    </li>
                    
                    <li>Team Room</li>
                </ul>
            </div>

            <div id={styles.sidebarBottom}>
                <ul>
                    <li onClick={() => openPage("Notification", notif, "/notification")} className={`${styles.item} ${isActive("/notification") ? styles.active : ""}`}><img src={notif} alt="Notification" style={{ width: "25px"}} />Notification</li>
                    <li><img src={setting} alt="Setting" style={{ width: "25px"}} />Setting</li>
                    <li onClick={() => navigate("/profile")}><img src={icon} alt="Profile" style={{ width: "35px"}} />Profile</li>
                </ul>
            </div>

           {/* --- MODAL POPUP JOIN TEAM --- */}
            {showJoinPopup && (
                <div className={styles.popupOverlay} onClick={() => setShowJoinPopup(false)}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        
                        {/* Header dengan Tombol Exit */}
                        <div className={styles.popupHeader}>
                            <h3>Join a Team</h3>
                            <button 
                                className={styles.exitButton} 
                                onClick={() => setShowJoinPopup(false)}
                            >
                            <img src={exit} alt="Exit" />
                            </button>
                        </div>

                        <div className={styles.formGroup}>
                            <label><b>Insert ID Team</b></label>
                            <input 
                                type="text" 
                                placeholder="Example: 123" 
                                value={teamIdInput}
                                onChange={(e) => setTeamIdInput(e.target.value)}
                            />
                        </div>
                        
                        <div className={styles.buttonContainer}>
                            <button className={styles.confirmButton} onClick={handleJoinTeam}>Confirm</button>
                            <button className={styles.cancelButton} onClick={() => setShowJoinPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;