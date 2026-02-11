"use client";

import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import styles from "./personal-information.module.css";

export default function PersonalInformation() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name, city")
        .eq("id", user.id)
        .single();

      setForm({
        name: data?.name ?? "",
        city: data?.city ?? "",
        email: user.email ?? "",
      });

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        city: form.city,
      })
      .eq("id", user.id);

    setSaving(false);

    if (!error) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (loading) {
    return <p>Loading profile…</p>;
  }

  return (
    <RequireAuth>
      {/* 🔔 TOAST */}
      {showToast && (
        <div className={styles.toast}>
          Personal information updated
        </div>
      )}

      <div className={styles.wrapper}>
        <h2 className={styles.title}>Personal Information</h2>
        <p className={styles.subtitle}>
          Update your personal details
        </p>

        <form onSubmit={handleSave} className={styles.form}>
          <label className={styles.label}>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              value={form.email}
              disabled
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            City
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className={styles.input}
            />
          </label>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </RequireAuth>
  );
}
