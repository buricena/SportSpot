"use client";
import heroImage from "./media/background.jpeg";
import { CalendarDays, LandPlot, MapPin } from "lucide-react"; // uvoz Lucide ikone
import MapSection from "./components/MapSection";


export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <main
        className="hero"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      >
        <div className="hero-overlay">
          <h1>Find Your Game.</h1>
          <p>
            Connect with local players and discover non-professional sports
            events in your area
          </p>

          {/* New Button */}
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
              🔍<span className="step-number">01</span>
            </div>
            <h3>Discover Events</h3>
            <p>Browse local matches and tournaments near you</p>
          </div>

          <div className="step">
            <div className="step-icon">
              👥<span className="step-number">02</span>
            </div>
            <h3>Join & Connect</h3>
            <p>Register for events and meet new players</p>
          </div>

          <div className="step">
            <div className="step-icon">
              🏆<span className="step-number">03</span>
            </div>
            <h3>Play & Track</h3>
            <p>Participate and follow your results</p>
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
          <MapSection />

          <div className="events-list">
            <h3>Nearby Events</h3>

            <div className="event-card">
              <span className="tag football">Football</span>
              <strong>5v5 Match</strong>
              <p>Central Park</p>
              <span className="distance">1.2 km</span>
            </div>

            <div className="event-card">
              <span className="tag basketball">Basketball</span>
              <strong>3v3 Basketball</strong>
              <p>Downtown Court</p>
              <span className="distance">2.5 km</span>
            </div>

            <div className="event-card">
              <span className="tag tennis">Tennis</span>
              <strong>Doubles Match</strong>
              <p>Riverside Club</p>
              <span className="distance">3.8 km</span>
            </div>

            <button className="explore-btn">Explore Map View</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            {/* Dodana Lucide ikona pored naslova */}
            <h3 className="logo">
              <LandPlot size={24} style={{ marginRight: "8px" }} />
              SportSpot
            </h3><br />

            <p>
              Your local sports community. Connect, play, and track your sports
              activities.
            </p>
          </div>

          <div>
            <h4>Platform</h4>
            <a>Discover</a>
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
