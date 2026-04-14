import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMessages, sendMessage } from "../../services/chatService";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, MoreVertical, MessageCircle } from "lucide-react";
import api from "../../services/api";

const ChatWindow = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [targetUser, setTargetUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const scrollRef = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${userId}`);
                setTargetUser(response.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMessages(userId);
                setMessages(data);
                setError("");
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds for "near real-time"
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const msg = await sendMessage(userId, newMessage);
            setMessages([...messages, msg]);
            setNewMessage("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send message");
        }
    };

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col bg-[#F5EAD7]">
                {/* Chat Header */}
                <div className="bg-white border-b-2 border-black p-3 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/chat")}
                            className="p-1.5 hover:bg-black/5 rounded-xl transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-[#FFD9A0]">
                                {targetUser?.avatar ? (
                                    <img src={targetUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-bold uppercase italic">
                                        {targetUser?.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-black text-black text-base uppercase italic tracking-tight">
                                    {targetUser?.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    <span className="text-[9px] font-bold text-black/40 uppercase tracking-tighter">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="p-1.5 hover:bg-black/5 rounded-xl transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="max-w-4xl mx-auto w-full space-y-4 flex flex-col">
                        {loading ? (
                            <div className="flex justify-center mt-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center mt-20 opacity-30 text-black">
                                <MessageCircle size={64} strokeWidth={1} />
                                <p className="font-bold text-xl italic uppercase tracking-widest mt-4">Start your conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={msg._id || idx}
                                    className={`flex ${msg.sender === userId ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-[85%] md:max-w-[70%] p-3 px-4 border-2 border-black rounded-2xl font-bold text-[13px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                      ${msg.sender === userId
                                                ? "bg-white text-black rounded-tl-none font-medium"
                                                : "bg-[#FFD9A0] text-black rounded-tr-none"}`}
                                    >
                                        <p>{msg.text}</p>
                                        <div className="mt-1 text-[8px] opacity-30 text-right uppercase italic">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={scrollRef} />
                    </div>
                </div>

                {/* Input area */}
                <div className="p-4 bg-white border-t-2 border-black">
                    <div className="max-w-4xl mx-auto w-full">
                        {error && (
                            <div className="mb-2 p-2 bg-red-100 border-2 border-red-500 text-red-600 font-bold text-[10px] uppercase rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSend} className="flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 bg-black/5 border-2 border-black p-3 font-bold text-sm text-black placeholder:text-black/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-black transition-all"
                            />
                            <button
                                type="submit"
                                className="px-5 bg-black text-white font-black uppercase italic tracking-widest hover:bg-orange-600 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(255,106,43,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatWindow;
