"use client";

import Image from "next/image";
import heroImage from "./media/background.jpeg";
import { LandPlot, Search, Users, Trophy } from "lucide-react";
import MapSection, { Event } from "./components/MapSection";
import { useState, useEffect } from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { useScrollAnimation } from "./hooks/useScrollAnimation";

// ---------------- TYPES ----------------

type FeaturedEvent = {
  eventId: string;
  title: string;
  description: string;
};

// ---------------- COMPONENT ----------------

export default function HomePage() {
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);

  useScrollAnimation();

  // ---------------- FETCH CMS EVENTS ----------------

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  async function fetchFeaturedEvents() {
    const data = await sanityClient.fetch(
      `
      *[_type == "featuredEvent"]{
        eventId,
        title,
        description
      }
    `,
      {},
      { next: { revalidate: 3600 } }
    );

    setFeaturedEvents(data || []);
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <main className="hero">
        <Image
          src={heroImage}
          alt="SportSpot hero background"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />

        <div className="hero-overlay animate">
          <h1>Find Your Game.</h1>
          <p>
            Connect with local players and discover non-professional sports
            events in your area
          </p>
          <button
            className="hero-btn"
            onClick={() => (window.location.href = "/events")}
          >
            Explore Events
          </button>
        </div>
      </main>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works animate">
        <h2>How It Works</h2>
        <p className="how-subtitle">
          From finding a game to stepping on the field — here's how SportSpot gets you playing
        </p>

        <div className="steps">
          <div className="step animate delay-1">
            <div className="step-icon">
              <Search size={42} />
            </div>
            <h3>Search by Sport & Location</h3>
            <p>
              Filter events by sport type, city, or use the interactive map to
              find games happening near you — today, this week, or anytime.
            </p>
          </div>

          <div className="step animate delay-2">
            <div className="step-icon">
              <Users size={42} />
            </div>
            <h3>Sign Up & Reserve Your Spot</h3>
            <p>
              Create a free account, pick an event, and confirm your attendance.
            </p>
          </div>

          <div className="step animate delay-3">
            <div className="step-icon">
              <Trophy size={42} />
            </div>
            <h3>Play & See the Results</h3>
            <p>
              Show up, compete, and check back afterwards for results from every event you've joined.
            </p>
          </div>
        </div>
      </section>

      {/* ================= EVENTS AROUND YOU ================= */}
      <section className="events-around animate">
        <h2>Events Around You</h2>
        <p className="events-subtitle">
          Explore sports events on an interactive map and find activities near
          your location
        </p>

        <div className="events-layout">
          <MapSection onEventsFetched={setNearbyEvents} />

          <div className="events-list animate delay-2">
            <h3>Events you might be interested in</h3>

            {featuredEvents.length === 0 && <p>No upcoming events.</p>}

            {featuredEvents.map(event => (
              <div key={event.eventId} className="event-card">
                <span className="tag featured">Upcoming</span>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
              </div>
            ))}

            <button
              className="explore-btn"
              onClick={() => (window.location.href = "/map")}
            >
              Explore Map view
            </button>
          </div>
        </div>
      </section>


    </>
  );
}