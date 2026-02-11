import Link from "next/link";
import { MapPinOff } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <MapPinOff size={42} className={styles.icon} />
        <h2>Event not found</h2>
        <p>
          The event you’re looking for doesn’t exist or has been removed.
        </p>

        <Link href="/events" className={styles.button}>
          Back to events
        </Link>
      </div>
    </div>
  );
}
