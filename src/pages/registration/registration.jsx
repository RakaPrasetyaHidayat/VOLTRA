import IconText from "../../components/Icon/Icon.jsx";
import styles from "./Registration.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Registration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    let value = e.target.value;

    // ✅ Auto replace spasi jadi underscore untuk username
    if (e.target.name === "username") {
      value = value.replace(/\s+/g, "_");
    }

    setForm({
      ...form,
      [e.target.name]: value
    });
  };

  const handleRegister = async () => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // ✅ Validasi username
    if (!form.username.trim()) {
      alert("Username tidak boleh kosong!");
      return;
    }

    if (!usernameRegex.test(form.username)) {
      alert("Username hanya boleh huruf, angka, dan underscore (_)");
      return;
    }

    // ✅ Validasi email sederhana
    if (!form.email.includes("@")) {
      alert("Email tidak valid!");
      return;
    }

    // ✅ Validasi password
    if (form.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

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
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      console.log("Register response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Register gagal");
      }

      alert("Register berhasil!");

      // ✅ Ambil token fleksibel
      const token =
        data.token || data?.data?.token || data.accessToken;

      // ✅ Simpan profile awal ke localStorage
      localStorage.setItem("profile", JSON.stringify({
        username: form.username,
        avatar: "/Mr_Raka.jpg",
        company: "",
        officePosition: "",
        division: "",
        bio: ""
      }));

      if (token) {
        localStorage.setItem("token", token);
        navigate("/profile");
      } else {
        navigate("/login");
      }

    } catch (error) {
      console.error("Register error:", error.message);
      alert(error.message || "Server error");
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
            name="username"
            type="text"
            placeholder="Enter your name"
            value={form.username}
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
            <input type="checkbox" id="checkbox" /> I agree all statements in Terms of Service
          </label>
        </div>

        <button
          onClick={handleRegister}
          className={`${styles.btn} ${styles.primary}`}
        >
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