import Link from "next/link";

export default function MyPastEvents() {
  return (
    <main>
      <h1>My Past Events</h1>
      <p>See all events you have participated in before.</p>
      <Link href="/profile">Back to Profile</Link>
    </main>
  );
}
