import Link from "next/link";

export default function OrganizePage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Organize an Event</h1>
      <p>Here you can create your own event and invite participants.</p>


      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/events">← Back to Events</Link>
      </p>
    </main>
  );
}
