import { createPortal } from "react-dom";
import "../styles/LogoutModal.css";
export default function LogoutModal({ onConfirm, onCancel }) {
  return createPortal(
    <div className="logout-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="logout-title">Confirm Logout</h3>
        <p className="logout-text">Are you sure you want to logout?</p>
        <div className="logout-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-logout" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
