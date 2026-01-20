import styles from "./register.module.css";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Join SportSpot and start discovering events
        </p>

        <form className={styles.form}>
          <label>
            Name
            <input type="text" placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>

          <label>
            Favorite sport
            <select>
              <option>Football</option>
              <option>Basketball</option>
              <option>Tennis</option>
              <option>Volleyball</option>
            </select>
          </label>

          {/* MOCK REGISTER */}
          <button type="button" className={styles.submit}>
            Create Account
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
