"use client";

import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../profile.module.css";

export default function PersonalInformationPage() {
  const [loading, setLoading] = useState(true);
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

      const { data, error } = await supabase
        .from("profiles")
        .select("name, city")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("LOAD PROFILE ERROR:", error);
      }

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (error) {
      console.error("SAVE ERROR:", error);
      alert("Save failed");
      return;
    }

    alert("Profile saved");
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading profile…</p>;
  }

  return (
    <RequireAuth>
      <main className={styles.container}>
        <h1 className={styles.title}>Personal Information</h1>

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

          <button type="submit" className={styles.primaryBtn}>
            Save changes
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
