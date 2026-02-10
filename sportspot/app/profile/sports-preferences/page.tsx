"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./sports-preferences.module.css";

const ALL_SPORTS = [
  "Football",
  "Basketball",
  "Tennis",
  "Padel",
  "Running",
  "Cycling",
  "Gym",
  "Yoga",
];

export default function SportsPreferences() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);

    const { data } = await supabase
      .from("profiles")
      .select("sports")
      .eq("id", user.id)
      .single();

    setSelected(data?.sports ?? []);
    setLoading(false);
  };

  const toggleSport = (sport: string) => {
    setSelected(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const savePreferences = async () => {
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ sports: selected })
      .eq("id", user.id);

    setSaving(false);
    alert("Preferences saved");
  };

  if (loading) {
    return <p>Loading preferences…</p>;
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Sports Preferences</h2>
      <p className={styles.subtitle}>
        Choose sports you are interested in
      </p>

      <div className={styles.grid}>
        {ALL_SPORTS.map(sport => (
          <button
            key={sport}
            onClick={() => toggleSport(sport)}
            className={`${styles.tag} ${
              selected.includes(sport) ? styles.active : ""
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          onClick={savePreferences}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}
