import Link from "next/link";

export default function ParticipatePage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Participate in Events</h1>
      <p>Here you can browse and join events that interest you.</p>

    

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/events">← Back to Events</Link>
      </p>
    </main>
  );
}
