import styles from "./Notification.module.css";
import icon from "../../assets/icon.svg";

function Notification() {
    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div id={styles.notification}>
                        <h1>Your Checkbox: </h1>
                        <div id={styles.notifItem}>
                            <div className={styles.item}>
                                <img src={icon} alt="Icon" />
                                <div className={styles.boxItem}>
                                <h2>Notification</h2>
                                    <div>
                                        <p>From: Anonymous</p>
                                        <p>6/7/2067</p>
                                    </div>
                                </div>
                            </div>
                             <div className={styles.item}>
                                <img src={icon} alt="Icon" />
                                <div className={styles.boxItem}>
                                <h2>Notification</h2>
                                    <div>
                                        <p>From: Anonymous</p>
                                        <p>6/7/2067</p>
                                    </div>
                                </div>
                            </div>
                             <div className={styles.item}>
                                <img src={icon} alt="Icon" />
                                <div className={styles.boxItem}>
                                <h2>Notification</h2>
                                    <div>
                                        <p>From: Anonymous</p>
                                        <p>6/7/2067</p>
                                    </div>
                                </div>
                            </div>
                             <div className={styles.item}>
                                <img src={icon} alt="Icon" />
                                <div className={styles.boxItem}>
                                <h2>Notification</h2>
                                    <div>
                                        <p>From: Anonymous</p>
                                        <p>6/7/2067</p>
                                    </div>
                                </div>
                            </div>
                              <div className={styles.item}>
                                <img src={icon} alt="Icon" />
                                <div className={styles.boxItem}>
                                <h2>Notification</h2>
                                    <div>
                                        <p>From: Anonymous</p>
                                        <p>6/7/2067</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            
        </div>
    );
}

export default Notification;