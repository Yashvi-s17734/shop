import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h2>Jayendra Vasan Bhandar</h2>
          <p>
            Traditional sweets & snacks made with purity and trust for
            generations.
          </p>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Ghat Bazaar, Sihor – 364240</p>
          <p>📞 +91 98251 52881</p>
          <p>📞 +91 93283 37767</p>
        </div>

        {/* CTA */}
        <div className="footer-cta">
          <h3>Need help?</h3>
          <button>Chat on WhatsApp</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Jayendra Vasan Bhandar</p>
        <p>Made with ❤️ in India</p>
      </div>
    </footer>
  );
}
