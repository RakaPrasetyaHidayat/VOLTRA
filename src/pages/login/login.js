import IconText from "../../components/Icon/Icon.js";
import "./Login.module.css";
import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    <div className="container">
      
      <div id="tengah">
        <IconText />
      </div>

      <div id="box1">
        <h1 className="title">Welcome back!</h1>
        <p className="subtitle">
          Please enter your account to continue...
        </p>

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <div className="row">
          <label className="remember">
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" className="forgot">Forgot password?</a>
        </div>

        <button className="btn btn-primary">Sign in</button>

        <button className="btn btn-google">
            <FcGoogle className="google-icon" />
            Sign in with Google
        </button>

        <div className="footer-text">
          Don’t have an account? <a href="#">Sign up</a>
        </div>
      </div>

    </div>
  );
}

export default Login;
