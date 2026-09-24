import { useEffect, useRef, useState } from "react";
import { Bell, Check, Trash2, X, CheckCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";

export default function NotificationBell() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAll();

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await notificationService.markAsRead(notification.id);

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read_at: new Date().toISOString(),
                }
              : item
          )
        );

        setUnreadCount((count) => Math.max(0, count - 1));
      }

      const actionUrl = notification.data?.action_url;
      setOpen(false);

      if (actionUrl) {
        navigate(actionUrl);
      }
    } catch (error) {
      console.error("Failed to handle notification:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);

      await notificationService.markAllAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read_at: notification.read_at || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event, notificationId) => {
    event.stopPropagation();

    try {
      await notificationService.remove(notificationId);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId)
      );

      const deletedNotification = notifications.find(
        (notification) => notification.id === notificationId
      );

      if (deletedNotification && !deletedNotification.read_at) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2ECE6] bg-white text-[#5A6E63] shadow-sm transition-all hover:bg-[#F0F7F2] hover:text-[#111915] active:scale-95"
        aria-label="Notifications"
      >
        <Bell size={17} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 z-50 mt-2.5 w-80 sm:w-96 overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white/95 shadow-xl shadow-[#111915]/5 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2ECE6] bg-[#F0F7F2]/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-tight text-[#111915]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-md bg-[#065F46]/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#065F46]">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  title="Mark all as read"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5A6E63] transition hover:bg-white hover:text-[#065F46] disabled:opacity-50"
                >
                  <CheckCheck size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5A6E63] transition hover:bg-white hover:text-[#111915]"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E2ECE6]">
            {notifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F2] text-[#8BA094]">
                  <Sparkles size={18} />
                </div>
                <p className="text-xs font-bold text-[#111915]">
                  All caught up!
                </p>
                <p className="mt-0.5 text-[11px] text-[#5A6E63]">
                  You have no new notifications right now.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !notification.read_at;

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group relative flex cursor-pointer gap-3 p-3.5 transition-colors ${
                      isUnread
                        ? "bg-[#E6F4EA]/40 hover:bg-[#E6F4EA]/70"
                        : "bg-white hover:bg-[#F0F7F2]/40"
                    }`}
                  >
                    {/* Unread Indicator Pill */}
                    <div className="mt-1 flex flex-col items-center">
                      <span
                        className={`h-2 w-2 rounded-full transition-all ${
                          isUnread ? "bg-[#065F46]" : "bg-transparent"
                        }`}
                      />
                    </div>

                    {/* Notification Body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-xs ${
                            isUnread
                              ? "font-bold text-[#111915]"
                              : "font-semibold text-[#5A6E63]"
                          }`}
                        >
                          {notification.data?.title || "Notification"}
                        </h4>

                        <button
                          type="button"
                          onClick={(event) => handleDelete(event, notification.id)}
                          className="rounded-md p-1 text-[#8BA094] opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                          title="Delete notification"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#5A6E63] line-clamp-2">
                        {notification.data?.message}
                      </p>

                      <p className="mt-1.5 font-mono text-[9px] text-[#8BA094]">
                        {new Date(notification.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className="border-t border-[#E2ECE6] bg-[#F0F7F2]/30 p-2 text-center">
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={loading}
                className="w-full rounded-lg py-1.5 text-[11px] font-semibold text-[#065F46] transition hover:bg-white disabled:opacity-50"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}