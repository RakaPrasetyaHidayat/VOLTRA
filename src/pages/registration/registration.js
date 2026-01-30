import IconText from "../../components/Icon/Icon.js";
import styles from "./Registration.module.css";
import { FcGoogle } from "react-icons/fc";

function Registration() {
    return (
    <div className={styles.container}>
      
      <div id={styles.tengah}>
        <IconText />
      </div>

      <div id={styles.box1}>
        
        <h1 className={styles.title}>Create Account</h1>

        <div className={styles.field}>
          <label>Username</label>
          <input type="text" placeholder="Enter your name" />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <div className={styles.field}>
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" />
        </div>

        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" id="checkbox"/> I agree all statements in Terms of Service
          </label>
        </div>

        <button className={`${styles.btn} ${styles.primary}`}>Sign up</button>

        <button className={`${styles.btn} ${styles.google}`}>
            <FcGoogle className={styles.google_icon} />
            Sign un with Google
        </button>

        <div className={styles.footer_text}>
          Have already account? <a href="#">Sign In</a>
        </div>
      </div>

    </div>
  );
}


export default Registration;