import Link from "next/link";

export default function ResultsPage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Results</h1>
      <p>Here you can see the results of past events and competitions.</p>


          

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/">← Back to Homepage</Link>
      </p>
    </main>
  );
}
