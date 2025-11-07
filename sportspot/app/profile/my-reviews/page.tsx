import Link from "next/link";

export default function MyReviews() {
  return (
    <main>
      <h1>My Reviews</h1>
      <p>Read or edit your reviews of past events.</p>
      <Link href="/profile">Back to Profile</Link>
    </main>
  );
}
