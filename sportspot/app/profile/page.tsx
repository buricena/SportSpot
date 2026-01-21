"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./profile.module.css";

import MyEvents from "./my-events/page";
import MyReviews from "./my-reviews/page";
import PersonalInformation from "./personal-information/page";
import SportsPreferences from "./sports-preferences/page";

type Tab = "events" | "reviews" | "info" | "preferences";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const loadUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("LOAD NAME ERROR:", error);
        return;
      }

      if (data?.name) {
        setName(data.name);
      }
    };

    loadUserName();
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>

      <p className={styles.subtitle}>
        Welcome back{ name ? `, ${name}` : "" }
      </p>

      {/* TAB BAR */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("events")}
          className={`${styles.tab} ${
            activeTab === "events" ? styles.active : ""
          }`}
        >
          My Events
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`${styles.tab} ${
            activeTab === "reviews" ? styles.active : ""
          }`}
        >
          Reviews
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`${styles.tab} ${
            activeTab === "info" ? styles.active : ""
          }`}
        >
          Personal Info
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`${styles.tab} ${
            activeTab === "preferences" ? styles.active : ""
          }`}
        >
          Preferences
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {activeTab === "events" && <MyEvents />}
        {activeTab === "reviews" && <MyReviews />}
        {activeTab === "info" && <PersonalInformation />}
        {activeTab === "preferences" && <SportsPreferences />}
      </div>
    </main>
  );
}
