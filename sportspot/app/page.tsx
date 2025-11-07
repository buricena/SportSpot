import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>SportSpot Homepage</h1>
      <nav>
        <ul>
          <li><Link href="/discover">Discover</Link></li>
          <li><Link href="/profile">Profile</Link></li>
         
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/map">Map</Link></li>

          <li><Link href="/results">Results</Link></li>
        </ul>
      </nav>
    </main>
  );
}
