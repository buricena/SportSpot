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
  "Volleyball",
  "Handball",
  "Table tennis",
  "Pilates",
  "Chess"
];

export default function SportsPreferences() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("favorite_sport")
      .eq("id", user.id)
      .single();

    setSelected(data?.favorite_sport ?? []);
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({ favorite_sport: selected })
      .eq("id", user.id);

    setSaving(false);

    // 👉 show popup
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
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

      {/* ✅ TOAST */}
      {showSaved && (
        <div className={styles.toast}>
          Preferences saved successfully ✅
        </div>
      )}
    </div>
  );
}
