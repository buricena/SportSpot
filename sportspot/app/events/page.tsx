import Link from "next/link";
import { FC } from "react";

const EventsPage: FC = () => {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Events</h1>
      <p>Choose what you want to do:</p>

      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "200px",
          marginTop: "1rem",
        }}
      >
        <li>
          <Link href="/events/participate">
            <button style={{ padding: "0.5rem", cursor: "pointer" }}>
              Participate in Events
            </button>
          </Link>
        </li>
        <li>
          <Link href="/events/organize">
            <button style={{ padding: "0.5rem", cursor: "pointer" }}>
              Organize an Event
            </button>
          </Link>
        </li>
      </ul>

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/">← Back to Homepage</Link>
      </p>
    </main>
  );
};

export default EventsPage;
