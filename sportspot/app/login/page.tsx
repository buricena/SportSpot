import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>
          Sign in to access your profile and events
        </p>

        <form className={styles.form}>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>

          {/* MOCK LOGIN */}
          <button type="button" className={styles.submit}>
            Sign In
          </button>
        </form>

        <p className={styles.footerText}>
          Don’t have an account?{" "}
          <Link href="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}
