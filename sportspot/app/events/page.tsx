import Link from "next/link";

type Event = { id: number; title: string; body: string };

async function getEvents(): Promise<Event[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", { cache: "no-store" });
  return res.json();
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Events</h1>
      <ul>
        {events.slice(0, 10).map(event => (
          <li key={event.id}>
            <Link href={`/events/${event.id}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
