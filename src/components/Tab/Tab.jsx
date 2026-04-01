import styles from "./Tab.module.css";
import home from "../../assets/home.svg";
import task from "../../assets/task.svg";
import notes from "../../assets/notes.svg";
import notif from "../../assets/notification.svg";
import exit from "../../assets/exit.svg";

function Tab(){
    return(
        <div id={styles.pages}>
            <ul>
                <li style={{transform: "skewX(180deg)"}}><span  style={{transform: "skewX(180deg)"}}><img src={home} alt="Home" style={{ width: "20px" }}/>Home </span></li>
                <li><span><img src={notes} alt="Notes" style={{ width: "20px" }} />Notes </span> <img src={exit} alt="Exit" style={{ width: "30px", transform: "skewX(20deg)", position: "relative", left: "10px" }} /></li>
                <li><span><img src={notif} alt="Notification" style={{ width: "20px"}} />Notif...</span> <img src={exit} alt="Exit" style={{ width: "30px", transform: "skewX(20deg)", position: "relative", left: "8px" }} /></li>
                <li><span><img src={task} alt="Task" style={{ width: "20px" }} />Task</span><img src={exit} alt="Exit" style={{ width: "30px", transform: "skewX(20deg)", position: "relative", left: "20px" }} /></li>
            </ul>
          </div>
    )
}

export default Tab;