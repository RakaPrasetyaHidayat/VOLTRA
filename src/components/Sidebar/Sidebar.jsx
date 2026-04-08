import IconText from "../../components/Icon/Icon1.jsx";
import plus from "../../assets/plus.svg";
import setting from "../../assets/setting.svg";
import icon from "../../assets/icon.svg";
import search from "../../assets/search.svg";
import home from "../../assets/home.svg";
import task from "../../assets/task.svg";
import notes from "../../assets/notes.svg";
import notif from "../../assets/notification.svg";
import styles from "./Sidebar.module.css";
import { useTab } from "../../components/Tab/TabContext";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
    const { addTab } = useTab();
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const openPage = (name, icon, path) => {
    addTab(name, icon);
    navigate(path);
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
                <li><span><img src={plus} alt="Join Team" style={{ width: "25px" }} />Join Team</span></li>
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
        </div>
    )
}

export default Sidebar;