type Event = {
  id: number;
  title: string;
  body: string;
};

async function getEvent(id: string): Promise<Event | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data: Event = await res.json();
  return data.id ? data : null;
}

// async EventPage jer params je Promise
export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // <-- mora await

  const event = await getEvent(id);

  if (!event) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Event not found</h1>
        <p>The event with id {id} does not exist.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{event.title}</h1>
      <p>{event.body}</p>
    </main>
  );
}
