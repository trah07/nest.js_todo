import React, { useEffect } from "react";

const Notification = ({ notifications, onClose }) => {
  useEffect(() => {
    notifications.forEach((notification, index) => {
      if (notification.message) {
        const timer = setTimeout(() => {
          onClose(index);
        }, notification.duration || 3000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onClose]);

  if (!notifications.length) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div key={index} className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => onClose(index)} className="close-button">
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
