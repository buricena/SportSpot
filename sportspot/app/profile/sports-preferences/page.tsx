"use client";

import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../profile.module.css";

const sportsList = [
  "Football",
  "Basketball",
  "Tennis",
  "Volleyball",
  "Running",
  "Cycling",
  "Padel",
];

export default function SportsPreferencesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ LOAD FROM SUPABASE
  useEffect(() => {
    const loadPreferences = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("favorite_sport")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("LOAD PREF ERROR:", error);
      }

      if (data?.favorite_sport) {
        try {
          setSelected(JSON.parse(data.favorite_sport));
        } catch {
          setSelected([]);
        }
      }

      setLoading(false);
    };

    loadPreferences();
  }, []);

  // 2️⃣ TOGGLE
  const toggleSport = (sport: string) => {
    setSelected(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  // 3️⃣ SAVE TO SUPABASE
  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        favorite_sport: JSON.stringify(selected),
      })
      .eq("id", user.id);

    if (error) {
      console.error("SAVE PREF ERROR:", error);
      alert("Save failed");
      return;
    }

    alert("Preferences saved");
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading preferences...</p>;
  }

  return (
    <RequireAuth>
      <main className={styles.container}>
        <h1 className={styles.title}>Sport Preferences</h1>
        <p className={styles.subtitle}>
          Choose sports you are interested in
        </p>

        <div className={styles.tags}>
          {sportsList.map(sport => (
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

        <button onClick={handleSave} className={styles.primaryBtn}>
          Save preferences
        </button>
      </main>
    </RequireAuth>
  );
}
