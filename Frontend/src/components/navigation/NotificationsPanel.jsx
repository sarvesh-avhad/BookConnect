import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import {
    getNotifications,
    markAllRead,
} from "../../services/notificationService";

const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
        { label: "y", seconds: 31536000 },
        { label: "mo", seconds: 2592000 },
        { label: "d", seconds: 86400 },
        { label: "h", seconds: 3600 },
        { label: "m", seconds: 60 },
    ];
    for (const i of intervals) {
        const count = Math.floor(seconds / i.seconds);
        if (count > 0) return `${count}${i.label} ago`;
    }
    return "Just now";
};

const typeLabel = {
    like: "liked your post",
    comment: "commented on your post",
    exchange_request: "requested an exchange",
    exchange_accepted: "accepted your exchange",
};

const NotificationsPanel = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const panelRef = useRef(null);

    const load = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnread(data.filter((n) => !n.read).length);
        } catch {
            /* silent */
        }
    };

    useEffect(() => {
        load();
        // poll every 30s
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleOpen = async () => {
        setOpen((v) => !v);
        if (!open && unread > 0) {
            await markAllRead();
            setUnread(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }
    };

    return (
        <div ref={panelRef} className="relative w-full flex flex-col items-center">
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="relative w-full flex items-center gap-3 py-2.5 px-3 rounded-2xl transition hover:bg-black/5"
            >
                <div className="relative">
                    <Bell size={20} className="text-black" />
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center border border-white">
                            {unread > 9 ? "9+" : unread}
                        </span>
                    )}
                </div>
                <span className="text-[13px] font-semibold text-black">Alerts</span>
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute left-full top-0 ml-2 w-80 bg-[#FFF7E6] border-2 border-black rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b-2 border-black/20 flex items-center justify-between">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        <span className="text-xs text-black/50">
                            {notifications.length} total
                        </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-black/50">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`flex gap-3 items-start px-4 py-3 border-b border-black/10 ${!n.read ? "bg-orange-50" : ""
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold text-xs flex-shrink-0">
                                        {n.sender?.avatar ? (
                                            <img
                                                src={n.sender.avatar}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            n.sender?.name?.charAt(0) || "?"
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs leading-snug">
                                            <span className="font-bold">{n.sender?.name}</span>{" "}
                                            {typeLabel[n.type] || n.type}
                                        </p>
                                        {n.post?.caption && (
                                            <p className="text-[11px] text-black/50 mt-0.5 truncate">
                                                "{n.post.caption}"
                                            </p>
                                        )}
                                        <p className="text-[10px] text-black/40 mt-1">
                                            {timeAgo(n.createdAt)}
                                        </p>
                                    </div>

                                    {/* Book thumbnail */}
                                    {n.post?.image && (
                                        <div className="w-8 h-10 rounded border border-black/20 overflow-hidden flex-shrink-0">
                                            <img
                                                src={n.post.image}
                                                alt="post"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPanel;
