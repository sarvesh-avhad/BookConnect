import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getRecommendedUsers, followUser } from "../../services/userService";
import { useToast } from "../../context/ToastContext";
import { UserPlus } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const RecommendedUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const { refreshUser } = useContext(AuthContext);

    const load = async () => {
        try {
            const data = await getRecommendedUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to load recommended users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleFollow = async (id, name) => {
        try {
            await followUser(id);
            showToast(`Followed ${name}`);
            // Update global user state for following count
            refreshUser();
            // Remove followed user from the local list
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            showToast("Follow failed", "error");
        }
    };

    if (loading) return <div className="p-4 text-xs opacity-50">Discovery loading...</div>;
    if (users.length === 0) return null;

    return (
        <div className="bg-[#FFF7E6] border-2 border-black rounded-2xl overflow-hidden mt-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="py-3 px-4 border-b-2 border-black/10 bg-[#FFD9A0]/30">
                <h3 className="font-black text-[11px] uppercase italic tracking-wider flex items-center gap-2">
                    <UserPlus size={14} />
                    Who to follow
                </h3>
            </div>

            <div className="flex flex-col">
                {users.map((u) => (
                    <div
                        key={u._id}
                        className="flex items-center gap-3 p-3 border-b border-black/5 last:border-0 hover:bg-black/5 transition group"
                    >
                        <Link to={`/profile/${u._id}`} className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold text-sm">
                                {u.avatar ? (
                                    <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    u.name?.charAt(0) || "U"
                                )}
                            </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                            <Link
                                to={`/profile/${u._id}`}
                                className="font-bold text-xs block truncate hover:underline"
                            >
                                {u.name}
                            </Link>
                            <p className="text-[10px] text-black/50 truncate">
                                {u.bio || "Reader"}
                            </p>
                        </div>

                        <button
                            onClick={() => handleFollow(u._id, u.name)}
                            className="px-2.5 py-1 bg-white border-2 border-black rounded-lg text-[9px] font-black uppercase italic hover:bg-orange-400 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedUsers;
