"use client";

import { Loader2 } from "lucide-react";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Loader2 size={42} className={styles.spinner} />
        <h2>Loading</h2>
        <p>Please wait while we fetch the data</p>
      </div>
    </div>
  );
}
