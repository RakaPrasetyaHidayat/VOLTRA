import { useNavigate, Link } from "react-router-dom";
import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Login.module.css";
import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    <div className={styles.container}>
        <IconText />
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
          <Link to="/forgot-password" className={styles.forgot}>Forgot password?</Link>
        </div>

        <button className={`${styles.btn} ${styles.primary}`}>Sign in</button>

        <button className={`${styles.btn} ${styles.google}`}>
            <FcGoogle className={styles.google_icon} />
            Sign in with Google
        </button>

        <div className={styles.footer_text}>
          Don’t have an account?{" "}
          <Link to="/register">Sign up</Link>
        </div>
      </div>

    </div>
  );
}

export default Login;
