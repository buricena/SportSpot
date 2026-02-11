"use client";

import { AlertTriangle } from "lucide-react";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <AlertTriangle size={42} className={styles.icon} />
        <h2>Something went wrong</h2>
        <p>
          We couldn’t load this page. Please try again.
        </p>

        <button onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
