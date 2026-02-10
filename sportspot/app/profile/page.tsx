"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Mail,
  MapPin,
  Calendar,
  Star,
  User,
  Settings,
} from "lucide-react";

import styles from "./profile.layout.module.css";

import MyEvents from "./my-events/page";
import MyReviews from "./my-reviews/page";
import PersonalInformation from "./personal-information/page";
import SportsPreferences from "./sports-preferences/page";

type Tab = "events" | "reviews" | "info" | "preferences";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    city: "",
    eventsCount: 0,
    reviewsCount: 0,
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

      const { count: eventsCount } = await supabase
        .from("event_participants")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: reviewsCount } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setProfile({
        name: data?.name ?? "",
        city: data?.city ?? "",
        email: user.email ?? "",
        eventsCount: eventsCount ?? 0,
        reviewsCount: reviewsCount ?? 0,
      });
    };

    loadProfile();
  }, []);

  return (
    <main className={styles.page}>
      {/* PROFILE CARD */}
      <section className={styles.profileCard}>
        <div className={styles.avatar}>
          {profile.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className={styles.profileInfo}>
          <h1>{profile.name || "User"}</h1>
          <p className={styles.welcome}>
            Welcome back! Here is your profile overview.
          </p>

          <div className={styles.meta}>
            <span>
              <Mail size={16} />
              {profile.email}
            </span>

            {profile.city && (
              <span>
                <MapPin size={16} />
                {profile.city}
              </span>
            )}
          </div>

          <div className={styles.stats}>
            <span>
              <Calendar size={16} />
              <b>{profile.eventsCount}</b> Events Joined
            </span>

            <span>
              <Star size={16} />
              <b>{profile.reviewsCount}</b> Reviews
            </span>
          </div>
        </div>
      </section>

      {/* TABS */}
      <nav className={styles.tabs}>
        <button
          className={activeTab === "events" ? styles.active : ""}
          onClick={() => setActiveTab("events")}
        >
          <Calendar size={16} />
          My Events
        </button>

        <button
          className={activeTab === "reviews" ? styles.active : ""}
          onClick={() => setActiveTab("reviews")}
        >
          <Star size={16} />
          Reviews
        </button>

        <button
          className={activeTab === "info" ? styles.active : ""}
          onClick={() => setActiveTab("info")}
        >
          <User size={16} />
          Personal Info
        </button>

        <button
          className={activeTab === "preferences" ? styles.active : ""}
          onClick={() => setActiveTab("preferences")}
        >
          <Settings size={16} />
          Preferences
        </button>
      </nav>

      {/* CONTENT */}
      <section className={styles.content}>
        {activeTab === "events" && <MyEvents />}
        {activeTab === "reviews" && <MyReviews />}
        {activeTab === "info" && <PersonalInformation />}
        {activeTab === "preferences" && <SportsPreferences />}
      </section>
    </main>
  );
}
