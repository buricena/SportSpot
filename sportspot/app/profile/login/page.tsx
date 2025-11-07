import Link from "next/link";

export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <p>Use this page to log into your SportSpot account.</p>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
          gap: "0.5rem",
        }}
      >
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <hr style={{ margin: "1rem 0" }} />

      <h2>After logging in:</h2>
      <ul>
        <li><Link href="/profile/personal-information">Personal Information</Link></li>
        <li><Link href="/profile/sports-preferences">Sports Preferences</Link></li>
        <li><Link href="/profile/my-past-events">My Past Events</Link></li>
        <li><Link href="/profile/my-reviews">My Reviews</Link></li>
      </ul>

      <Link href="/">Back to Homepage</Link>
    </main>
  );
}
