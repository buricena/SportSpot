import Link from "next/link";

export default function PersonalInformation() {
  return (
    <main>
      <h1>Personal Information</h1>
      <p>View and update your personal details here.</p>
      <Link href="/profile">Back to Profile</Link>
    </main>
  );
}
