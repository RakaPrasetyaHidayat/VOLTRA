import styles from "./Navbar.module.css";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineTask } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { GoProject } from "react-icons/go";
import { MdOutlineMessage } from "react-icons/md";

function Navbar() {
    return(
       <nav className={styles.navbar}>
        <li className={styles.item}><AiOutlineHome className={styles.home}/>Home</li>
        <li className={styles.item}><MdOutlineTask className={styles.task}/>Task</li>
        <li className={styles.item}><GrNotes className={styles.notes}/>Notes</li>
        <li className={styles.item}><GoProject className={styles.project}/>Project</li>
        <li className={styles.item}><MdOutlineMessage className={styles.message}/>Message</li>


       </nav>
    )
    }

export default Navbar;