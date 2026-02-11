"use client";

import heroImage from "./media/background.jpeg";
import { LandPlot } from "lucide-react";
import MapSection, { Event } from "./components/MapSection";
import { useState } from "react";
import Link from "next/link";
import { Search, Users, Trophy } from "lucide-react";



export default function HomePage() {
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);

  return (
    <>
      {/* HERO */}
      <main className="hero" style={{ backgroundImage: `url(${heroImage.src})` }}>
        <div className="hero-overlay">
          <h1>Find Your Game.</h1>
          <p>
            Connect with local players and discover non-professional sports
            events in your area
          </p>
          <button className="hero-btn" onClick={() => window.location.href = '/events'}>
            Explore Events
          </button>
        </div>
      </main>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="how-subtitle">
          Get started in three simple steps and join your local sports community
        </p>

        <div className="steps">
  <div className="step">
    <div className="step-icon">
      <Search size={42} />  {/* Lucide ikona */}
      {/* <span className="step-number">1</span> */}
    </div>
    <h3>Discover Events</h3>
    <p>Browse local matches and tournaments near you</p>
  </div>

  <div className="step">
    <div className="step-icon">
      <Users size={42} />
      {/* <span className="step-number">2</span> */}
    </div>
    <h3>Join & Connect</h3>
    <p>Register for events and meet new players</p>
  </div>

  <div className="step">
    <div className="step-icon">
      <Trophy size={42} />
      {/* <span className="step-number">3</span> */}
    </div>
    <h3>Play & Track</h3>
    <p>Participate and view final results</p>
  </div>
</div>

      </section>

      {/* EVENTS AROUND YOU */}
      <section className="events-around">
        <h2>Events Around You</h2>
        <p className="events-subtitle">
          Explore sports events on an interactive map and find activities near
          your location
        </p>

        <div className="events-layout">
          {/* Mapa */}
          <MapSection onEventsFetched={setNearbyEvents} />

          {/* Lista događaja */}
          <div className="events-list">
           <h3>Upcoming Events</h3>

{nearbyEvents.length === 0 && <p>No upcoming events.</p>}

{nearbyEvents.map(event => (
  <Link
    key={event.id}
    href={`/events/${event.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div className="event-card">
      <span className={`tag ${event.sport.toLowerCase()}`}>
        {event.sport}
      </span>

      <strong>{event.title}</strong>
      <p>{event.location}</p>

      <span className="distance">
        {new Date(event.event_date).toLocaleDateString("hr-HR")}
      </span>
    </div>
  </Link>
))}

            <button className="explore-btn" onClick={() => window.location.href = '/map'}>
              Explore Map view
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3 className="logo">
              <LandPlot size={24} style={{ marginRight: "8px" }} />
              SportSpot
            </h3>
            <br />
            <p>
              Your local sports community. Connect, play, and track your sports
              activities.
            </p>
          </div>
          <div>
            <h4>Platform</h4>
            <a>Events</a>
            <a>Map</a>
            <a>Results</a>
          </div>
          <div>
            <h4>Organize</h4>
            <a>Create Event</a>
            <a>Manage Events</a>
            <a>Analytics</a>
          </div>
          <div>
            <h4>Support</h4>
            <a>Help Center</a>
            <a>Contact</a>
            <a>Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 SportSpot. All rights reserved.
        </div>
      </footer>
    </>
  );
}
