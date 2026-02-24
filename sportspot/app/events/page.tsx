"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, MapPin, X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";
import styles from "./events.module.css";

type Event = {
  id: string;
  title: string;
  description: string;
  sport: string;
  event_date: string;
  location: string;
};

type Tab = "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  // ✅ SINGLE DATE FILTER
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const router = useRouter();
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  useEffect(() => {
    fetchEvents();
    setDateFilter(null); // reset date on tab switch
  }, [activeTab]);

  async function fetchEvents() {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { data: upcoming } = await supabase
      .from("events")
      .select("id")
      .gte("event_date", today);

    const { data: past } = await supabase
      .from("events")
      .select("id")
      .lt("event_date", today);

    setUpcomingCount(upcoming?.length ?? 0);
    setPastCount(past?.length ?? 0);

    const query =
      activeTab === "upcoming"
        ? supabase
            .from("events")
            .select("*")
            .gte("event_date", today)
            .order("event_date", { ascending: true })
        : supabase
            .from("events")
            .select("*")
            .lt("event_date", today)
            .order("event_date", { ascending: false });

    const { data } = await query;
    setEvents(data || []);
    setLoading(false);
  }

  /* ================= FILTER OPTIONS ================= */
  const sports = useMemo(
    () => [...new Set(events.map(e => e.sport))].sort(),
    [events]
  );

  const locations = useMemo(
    () => [...new Set(events.map(e => e.location))].sort(),
    [events]
  );

  /* ================= FILTER LOGIC ================= */
  const filtered = events.filter(e => {
    const matchesSearch = `${e.title} ${e.sport} ${e.location}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSport = !sportFilter || e.sport === sportFilter;
    const matchesLocation = !locationFilter || e.location === locationFilter;

    const eventDate = new Date(e.event_date).toISOString().split("T")[0];
    const matchesDate = !dateFilter || eventDate === dateFilter;

    return (
      matchesSearch &&
      matchesSport &&
      matchesLocation &&
      matchesDate
    );
  });

  const hasActiveFilters =
    search || sportFilter || locationFilter || dateFilter;

  function clearAllFilters() {
    setSearch("");
    setSportFilter(null);
    setLocationFilter(null);
    setDateFilter(null);
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <span className={styles.kicker}>EVENTS</span>
        <h1>Discover Sports Events</h1>
        <p className={styles.subtitle}>
          Browse upcoming and past sports events. Find your next game,
          tournament, or match.
        </p>

        <div className={styles.topBar}>
          <input
            className={styles.search}
            placeholder="Search events by name, sport, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className={styles.actions}>
            {/* TABS */}
            <div className={styles.tabs}>
              <div
                className={`${styles.slider} ${
                  activeTab === "past"
                    ? styles.slideRight
                    : styles.slideLeft
                }`}
              />

              <button
                className={`${styles.tab} ${
                  activeTab === "upcoming" ? styles.activeText : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming <span>{upcomingCount}</span>
              </button>

              <button
                className={`${styles.tab} ${
                  activeTab === "past" ? styles.activeText : ""
                }`}
                onClick={() => setActiveTab("past")}
              >
                Past <span>{pastCount}</span>
              </button>
            </div>

            {/* ADD EVENT */}
            <Link
              href="/events/create"
              className={styles.addBtn}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  setShowLoginNotice(true);
                  setTimeout(() => {
                    setShowLoginNotice(false);
                    router.push("/login");
                  }, 2500);
                }
              }}
            >
              + Add Event
            </Link>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      {(sports.length > 0 || locations.length > 0) && (
        <div className={styles.filters}>
          {/* SPORT */}
          {sports.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Sport</span>
              <div className={styles.pills}>
                {sports.map(sport => (
                  <button
                    key={sport}
                    className={`${styles.pill} ${
                      sportFilter === sport ? styles.pillActive : ""
                    }`}
                    onClick={() =>
                      setSportFilter(
                        sportFilter === sport ? null : sport
                      )
                    }
                  >
                    {sport}
                    {sportFilter === sport && <X size={12} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LOCATION */}
          {locations.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Location</span>
              <select
                className={styles.filterSelect}
                value={locationFilter ?? ""}
                onChange={e =>
                  setLocationFilter(e.target.value || null)
                }
              >
                <option value="">All locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ✅ CUSTOM DATE PICKER – FIXED */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Date</span>

            <div
              className={styles.customDate}
              onClick={() => dateInputRef.current?.showPicker()}
            >
              <Calendar size={14} />
              <span>
                {dateFilter
                  ? new Date(dateFilter).toLocaleDateString("hr-HR")
                  : "Select date"}
              </span>

              {dateFilter && (
                <button
                  className={styles.clearDate}
                  onClick={e => {
                    e.stopPropagation();
                    setDateFilter(null);
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <input
              ref={dateInputRef}
              type="date"
              className={styles.hiddenDateInput}
              value={dateFilter ?? ""}
              onChange={e =>
                setDateFilter(e.target.value || null)
              }
            />
          </div>

          {/* CLEAR */}
          {hasActiveFilters && (
            <button
              className={styles.clearFilters}
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {showLoginNotice && (
        <div className={styles.loginNotice}>
          You must be logged in to create an event
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Loading events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyHeading}>
            {hasActiveFilters
              ? "No events match your filters"
              : activeTab === "upcoming"
              ? "No upcoming events yet"
              : "No past events to show"}
          </p>
          <p className={styles.emptyText}>
            {hasActiveFilters
              ? "Try adjusting your filters or clearing them."
              : activeTab === "upcoming"
              ? "Be the first to organize something!"
              : "Past events will appear here."}
          </p>
        </div>
      ) : (
        <section className={styles.grid}>
          {filtered.map(event => (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <span className={styles.sport}>{event.sport}</span>
                <span
                  className={`${styles.status} ${
                    activeTab === "past"
                      ? styles.past
                      : styles.upcoming
                  }`}
                >
                  {activeTab === "past" ? "Past" : "Upcoming"}
                </span>
              </div>

              <h3>{event.title}</h3>
              <p className={styles.desc}>{event.description}</p>

              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <Calendar size={14} className={styles.metaIcon} />
                  {new Date(event.event_date).toLocaleDateString("hr-HR")}
                </span>

                <span className={styles.metaItem}>
                  <MapPin size={14} className={styles.metaIcon} />
                  {event.location}
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}