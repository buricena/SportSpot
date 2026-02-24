export default function Footer() {
  return (
    <footer className="footer animate">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">SportSpot</div>
          <p>
            Your local sports community.
            <br />
            Connect, play and track your events.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="/events">Events</a>
            <a href="/map">Event map</a>
            <a href="/results">Results</a>
          </div>

          <div>
            <h4>Account</h4>
            <a href="/login">Sign in</a>
            <a href="/register">Create account</a>
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
  );
}