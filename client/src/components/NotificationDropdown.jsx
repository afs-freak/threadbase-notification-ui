
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();

  const notifications = state?.notifications ?? [];
  const unreadCount = state?.unreadCount ?? 0;

  function handleMarkAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px" }}>
          Notifications
        </h3>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{
            background: "none",
            border: "none",
            color: unreadCount > 0 ? "#2563eb" : "#9ca3af",
            cursor: unreadCount > 0 ? "pointer" : "default",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p
          style={{
            padding: "24px 16px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          No notifications yet.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
