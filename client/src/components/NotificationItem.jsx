import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification, onClose }) {
  const { dispatch } = useNotifications();

  const markReadMutation = useMutation({
    mutationFn: async (id) =>
      apiClient.patch(`/api/notifications/${id}/read`),

    onMutate: (id) => {
      dispatch({ type: "MARK_READ", payload: id });
    },

    onError: async (error) => {
      console.error("Failed to mark notification as read:", error);

      try {
        const response = await apiClient.get("/api/notifications");
        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: response.data,
        });
      } catch (refreshError) {
        console.error("Failed to refresh notifications:", refreshError);
      }
    },
  });

  function handleClick() {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    if (onClose) {
      onClose();
    }
  }

  const dateValue = notification.createdAt || notification.timestamp;
  const timestamp = dateValue ? new Date(dateValue) : null;
  const validTimestamp =
    timestamp && !Number.isNaN(timestamp.getTime());

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "14px 16px",
          border: "none",
          borderBottom: "1px solid #f3f4f6",
          textAlign: "left",
          cursor: "pointer",
          background: notification.isRead ? "#ffffff" : "#eff6ff",
          color: "#111827",
        }}
      >
        {!notification.isRead && (
          <span
            aria-label="Unread"
            style={{
              flexShrink: 0,
              width: "8px",
              height: "8px",
              marginTop: "6px",
              borderRadius: "50%",
              background: "#3b82f6",
            }}
          />
        )}

        <span style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: "14px",
              lineHeight: "1.5",
              overflowWrap: "anywhere",
            }}
          >
            {notification.message || "You have a new notification."}
          </span>

          {validTimestamp && (
            <time
              dateTime={timestamp.toISOString()}
              style={{
                display: "block",
                marginTop: "4px",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {timestamp.toLocaleString()}
            </time>
          )}
        </span>
      </button>
    </li>
  );
}