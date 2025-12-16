type Result = {
  id: number;
  title: string;
  body: string;
};

async function getResult(id: string): Promise<Result | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data: Result = await res.json();
  return data.id ? data : null;
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // <-- await zbog Next.js 13.4+ dynamic routes

  const result = await getResult(id);

  if (!result) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Result not found</h1>
        <p>The result with id {id} does not exist.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{result.title}</h1>
      <p>{result.body}</p>
    </main>
  );
}
