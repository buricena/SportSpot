"use client";

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

  // 🔥 activate scroll animations
  useScrollAnimation();

  // ---------------- FETCH CMS EVENTS ----------------

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  async function fetchFeaturedEvents() {
    const data = await sanityClient.fetch(`
      *[_type == "featuredEvent"]{
        eventId,
        title,
        description
      }
    `);

    setFeaturedEvents(data || []);
  }

  return (
    <>
      {/* HERO */}
      <main
        className="hero"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      >
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

      {/* HOW IT WORKS */}
      <section className="how-it-works animate">
        <h2>How It Works</h2>
        <p className="how-subtitle">
          Get started in three simple steps and join your local sports community
        </p>

        <div className="steps">
          <div className="step animate delay-1">
            <div className="step-icon">
              <Search size={42} />
            </div>
            <h3>Discover Events</h3>
            <p>Browse local matches and tournaments near you</p>
          </div>

          <div className="step animate delay-2">
            <div className="step-icon">
              <Users size={42} />
            </div>
            <h3>Join & Connect</h3>
            <p>Register for events and meet new players</p>
          </div>

          <div className="step animate delay-3">
            <div className="step-icon">
              <Trophy size={42} />
            </div>
            <h3>Play & Track</h3>
            <p>Participate and view final results</p>
          </div>
        </div>
      </section>

      {/* EVENTS AROUND YOU */}
      <section className="events-around animate">
        <h2>Events Around You</h2>
        <p className="events-subtitle">
          Explore sports events on an interactive map and find activities near
          your location
        </p>

        <div className="events-layout">
          {/* MAP */}
          <MapSection onEventsFetched={setNearbyEvents} />

          {/* CMS FEATURED EVENTS */}
          <div className="events-list animate delay-2">
            <h3>Events you might be interested in</h3>

            {featuredEvents.length === 0 && (
              <p>No upcoming events.</p>
            )}

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

      {/* FOOTER */}
      <footer className="footer animate">
  <div className="footer-inner">
    {/* BRAND */}
    <div className="footer-brand">
      <div className="footer-logo">SportSpot</div>
      <p>
        Your local sports community.<br />
        Connect, play and track your events.
      </p>
    </div>

    {/* LINKS */}
    <div className="footer-links">
      <div>
        <h4>Platform</h4>
        <a href="/events">Events</a>
        <a href="/map">Map</a>
        <a href="/results">Results</a>
      </div>

      <div>
        <h4>Account</h4>
        <a href="/profile">Profile</a>
        <a href="/profile/my-events">My Events</a>
        <a href="/profile/reviews">Reviews</a>
      </div>

<div>
  <h4>About</h4>
  <a href="/about">About us</a>
  <a href="/contact">Contact</a>
</div>

    </div>
  </div>

  <div className="footer-bottom">
    © 2026 SportSpot. All rights reserved.
  </div>
</footer>

    </>
  );
}
