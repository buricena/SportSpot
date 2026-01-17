type Event = {
  id: number;
  title: string;
  body: string;
};

async function getEvent(id: string): Promise<Event | null> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data: Event = await res.json();
  return data.id ? data : null;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await getEvent(id);

  if (!event) {
    return (
      <main style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h1>Event not found</h1>
        <p>The event with id {id} does not exist.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <span
          style={{
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          Upcoming Event
        </span>

        <h1 style={{ marginTop: "1rem" }}>{event.title}</h1>
      </header>

      <section style={{ marginBottom: "2.5rem", color: "#374151" }}>
        <p>{event.body}</p>
      </section>

      <section
        style={{
          background: "#f9fafb",
          padding: "1.5rem",
          borderRadius: "16px",
        }}
      >
        <h3>Event Details</h3>
        <ul style={{ marginTop: "1rem", color: "#6b7280" }}>
          <li>📍 Location: To be announced</li>
          <li>📅 Date: Upcoming</li>
          <li>👥 Participants: Open</li>
        </ul>
      </section>
    </main>
  );
}
