import styles from "./Header.module.css";
import IconText from "../Icon/Icon1";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

function Header() {
    return(
        <div className={styles.header}>
           <IconText />
            <div className={styles.container}>
            <IoSettingsOutline className={styles.icon}/>
            <FaRegBell className={styles.icon}/>
            <CgProfile className={styles.icon}/>
            </div>
           
        </div>
    )
}

export default Header;