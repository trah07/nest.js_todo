import React, { useEffect } from "react";

const Notification = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="close-button">
        X
      </button>
    </div>
  );
};

export default Notification;
