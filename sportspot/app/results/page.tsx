import Link from "next/link";

type Result = {
  id: number;
  title: string;
  body: string;
};

async function getResults(): Promise<Result[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", { cache: "no-store" });
  return res.json();
}

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Results</h1>
      <p>Browse all sports results</p>
      <ul>
        {results.slice(0, 10).map(result => (
          <li key={result.id}>
            <Link href={`/results/${result.id}`}>{result.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
