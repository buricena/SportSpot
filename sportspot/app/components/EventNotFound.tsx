"use client";

import { MapPinOff } from "lucide-react";
import styles from "./event-not-found.module.css";

type Props = {
  onBack: () => void;
};

export default function EventNotFound({ onBack }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <MapPinOff size={42} className={styles.icon} />
        <h1>Event not found</h1>
        <p>
          The event you’re looking for doesn’t exist or has been removed.
        </p>

        <button className={styles.button} onClick={onBack}>
          Back to events
        </button>
      </div>
    </div>
  );
}
