import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Login</h1>
      <p>Please log into your SportSpot account to access your profile options.</p>

      {/* Login form */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
          gap: "0.5rem",
          marginTop: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      <h2>Profile Menu</h2>
      <ul>
        <li><Link href="/profile/personal-information">Personal Information</Link></li>
        <li><Link href="/profile/sports-preferences">Sports Preferences</Link></li>
        <li><Link href="/profile/my-past-events">My Past Events</Link></li>
        <li><Link href="/profile/my-reviews">My Reviews</Link></li>
      </ul>

      <p style={{ marginTop: "1rem" }}>
        <Link href="/">← Back to Homepage</Link>
      </p>
    </main>
  );
}
