import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getRecentChats } from "../../services/chatService";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, User } from "lucide-react";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getRecentChats();
                setChats(data);
            } catch (err) {
                console.error("Failed to fetch chats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col bg-[#F5EAD7]">
                {/* Header */}
                <div className="bg-[#FFC107] py-6 px-8 border-b-2 border-black">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black flex items-center gap-3">
                        <MessageSquare size={32} strokeWidth={3} />
                        Messages
                    </h1>
                    <p className="mt-1 font-bold text-black/60 text-xs italic uppercase">
                        Communicate with your mutual connections.
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-black/10 animate-pulse rounded-2xl border-2 border-black/10" />
                            ))}
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20 gap-4 text-black/50">
                            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center">
                                <MessageSquare size={40} />
                            </div>
                            <p className="text-xl font-bold italic uppercase tracking-widest">No conversations yet</p>
                            <p className="text-sm font-semibold">Follow someone back to start chatting!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 max-w-3xl mx-auto w-full">
                            {chats.map((chat) => (
                                <div
                                    key={chat.user._id}
                                    onClick={() => navigate(`/chat/${chat.user._id}`)}
                                    className="flex items-center gap-4 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer rounded-xl group"
                                >
                                    <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden bg-[#FFD9A0] flex-shrink-0">
                                        {chat.user.avatar ? (
                                            <img src={chat.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                                                {chat.user.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-black text-black group-hover:text-orange-600 transition-colors uppercase italic truncate">
                                            {chat.user.name}
                                        </h3>
                                        <p className="text-black/50 font-bold text-xs truncate uppercase tracking-tight">
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                    <div className="text-[9px] font-black italic text-black/30 uppercase whitespace-nowrap">
                                        {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatList;
