import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Registration.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Registration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    try {
      const res = await fetch(
        "https://voltra-be.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Register berhasil!");
        navigate("/profile");
      } else {
        alert(data.message || "Register gagal");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Server error");
    }
  };

  return (
    <div className={styles.container}>
      <IconText />

      <div id={styles.box1}>
        <h1 className={styles.title}>Create Account</h1>

        <div className={styles.field}>
        <label>Username</label>
        <input
          name="fullName"
          type="text"
          placeholder="Enter your name"
          value={form.fullName}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>

        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" id="checkbox"/> I agree all statements in Terms of Service
          </label>
        </div>

        <button onClick={handleRegister} className={`${styles.btn} ${styles.primary}`}>
          Sign up
        </button>

        <button className={`${styles.btn} ${styles.google}`}>
          <FcGoogle className={styles.google_icon} />
          Sign in with Google
        </button>

        <div className={styles.footer_text}>
          Have already account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
