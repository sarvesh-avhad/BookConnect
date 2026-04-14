import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getRecommendedUsers, followUser } from "../../services/userService";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Users, UserPlus } from "lucide-react";

const ExchangeWidget = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const loadRecommended = async () => {
    try {
      setLoading(true);
      const data = await getRecommendedUsers();
      setRecommendedUsers(data);
    } catch (err) {
      console.error("Failed to load recommended users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommended();
  }, [user?.following?.length]); // Re-load when following list changes

  const handleFollow = async (targetId, name) => {
    try {
      await followUser(targetId);
      updateUser({
        ...user,
        following: [...(user.following || []), targetId],
      });
      showToast(`Followed ${name}! ✨`);
    } catch (err) {
      console.error("Follow failed", err);
      showToast("Follow failed", "error");
    }
  };

  return (
    <div className="bg-[#FFF7E6] border-2 border-black rounded-2xl overflow-hidden mt-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <div className="py-3 px-4 border-b-2 border-black/10 bg-[#FFD9A0]/30">
        <h3 className="font-black text-[11px] uppercase italic tracking-wider flex items-center gap-2">
          <Users size={14} />
          Readers you can follow
        </h3>
      </div>

      <div className="flex flex-col">
        {loading && recommendedUsers.length === 0 ? (
          <p className="text-[10px] font-bold text-black/40 p-4 uppercase italic animate-pulse">
            Finding readers...
          </p>
        ) : recommendedUsers.length === 0 ? (
          <p className="text-[10px] font-bold text-black/40 p-4 uppercase italic">
            No suggestions right now
          </p>
        ) : (
          recommendedUsers.map((u) => (
            <div
              key={u._id}
              className="p-3 border-b border-black/5 last:border-0 hover:bg-black/5 transition flex justify-between items-center group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Link to={`/profile/${u._id}`} className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-105">
                    {u.avatar ? (
                      <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      u.name?.charAt(0) || "U"
                    )}
                  </div>
                </Link>
                <div className="min-w-0">
                  <Link 
                    to={`/profile/${u._id}`}
                    className="font-black text-[11px] text-black truncate uppercase italic hover:underline decoration-2"
                  >
                    {u.name}
                  </Link>
                  <p className="text-[8px] font-bold text-black/40 uppercase truncate">
                    {u.bio || "Fellow Reader"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleFollow(u._id, u.name)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-xl hover:bg-orange-400 transition-all active:scale-95 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <UserPlus size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExchangeWidget;
