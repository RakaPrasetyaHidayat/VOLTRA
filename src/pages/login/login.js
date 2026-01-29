import IconText from "../../components/Icon/Icon.js";
import styles from "./Login.module.css";
import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    <div className={styles.container}>
      
      <div id={styles.tengah}>
        <IconText />
      </div>

      <div id={styles.box1}>
        
        <h1 className={styles.title}>Welcome back!</h1>
        <p className={styles.subtitle}>
          Please enter your account to continue...
        </p>

        <div className={styles.field}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" id="checkbox"/> Remember me
          </label>
          <a href="#" className={styles.forgot}>Forgot password?</a>
        </div>

        <button className={`${styles.btn} ${styles.primary}`}>Sign in</button>

        <button className={`${styles.btn} ${styles.google}`}>
            <FcGoogle className={styles.google_icon} />
            Sign in with Google
        </button>

        <div className={styles.footer_text}>
          Don’t have an account? <a href="#">Sign up</a>
        </div>
      </div>

    </div>
  );
}

export default Login;
