import Link from "next/link";

export default function SportsPreferences() {
  return (
    <main>
      <h1>Sports Preferences</h1>
      <p>Select your favorite sports or adjust your interests.</p>
      <Link href="/profile">Back to Profile</Link>
    </main>
  );
}
