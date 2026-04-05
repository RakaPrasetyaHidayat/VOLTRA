import { Link, useNavigate } from "react-router-dom";
import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Login.module.css";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
  if (!form.email || !form.password) {
    alert("Email dan password wajib diisi!");
    return;
  }

  try {
    const res = await fetch(
      "https://voltra-be.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        email: form.email,
        password: form.password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Login berhasil!");

      if (remember) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userEmail", form.email);
      } else {
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("userEmail", form.email);
      }

      navigate("/home");
    } else {
      const msg = data.message?.toLowerCase();

      if (msg?.includes("invalid credential")) {
        alert("Akun tidak ditemukan atau password salah. Silakan daftar atau cek password.");
        return;
      }

      alert(data.message || "Login gagal");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

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

        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" id="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/> Remember me
          </label>
          <Link to="/forgot-password" className={styles.forgot}>Forgot password?</Link>
        </div>

        <button
          onClick={handleLogin}
          className={`${styles.btn} ${styles.primary}`}
        >
          Sign in
        </button>

        <button className={`${styles.btn} ${styles.google}`}>
            <FcGoogle className={styles.google_icon} />
            Sign in with Google
        </button>

        <div className={styles.footer_text}>
          Don’t have an account?{" "}
          <Link to="/registration">Sign up</Link>
        </div>
      </div>

    </div>
  );
}

export default Login;
