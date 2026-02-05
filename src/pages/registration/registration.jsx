import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Registration.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function Registration() {
    return (
    <div className={styles.container}>
        <IconText />
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
            Sign in with Google
        </button>

        <div className={styles.footer_text}>
        Have already account?{" "}
        <Link to="/login">Sign In</Link>
        </div>

      </div>

    </div>
  );
}


export default Registration;