import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Trophy, Star } from "lucide-react";
import FollowModal from "./FollowModal";

const LEVELS = [
  { name: "Beginner Reader", min: 0, max: 50 },
  { name: "Active Reader", min: 51, max: 150 },
  { name: "Book Enthusiast", min: 151, max: 300 },
  { name: "Elite Bibliophile", min: 301, max: Infinity },
];

const ProfileHeader = ({ user, posts = [] }) => {
  const navigate = useNavigate();
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState("followers");

  if (!user) return null;

  return (
    <div className="border-b-2 border-black p-6 bg-[#F5EAD7]">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center text-2xl font-bold">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user.name?.charAt(0) || "U"
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">{user.name || "Unknown"}</h2>
            <div className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase italic rounded-lg flex items-center gap-1">
              <Trophy size={10} />
              {user.level || "Beginner Reader"}
            </div>
          </div>

          <p className="text-sm font-bold text-black/60 mt-1 uppercase tracking-tight">
            {user.bio || "Book lover on Book Connect"}
          </p>

          {/* Gamification Stats */}
          <div className="mt-6 bg-[#fff8ef] border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                <Star size={14} className="text-orange-500 fill-orange-500" />
                Level Progress
              </span>
              <span className="text-sm font-black uppercase px-3 py-1 bg-orange-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {user.points || 0} XP
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full h-6 bg-white border-2 border-black rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-red-400 border-r-2 border-black transition-all duration-1000 relative"
                style={{ width: `${Math.min(((user.points || 0) / (LEVELS.find(l => l.name === user.level)?.max || 50)) * 100, 100)}%` }}
              >
                {/* Stripe Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]"></div>
              </div>
            </div>

            {/* Badges */}
            {user.badges?.length > 0 && (
              <div className="flex gap-3 mt-4">
                {user.badges.map((badge, i) => (
                  <div key={i} className="group relative">
                    <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-help">
                      {badge.icon || "🎖️"}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] font-black uppercase italic rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-[11px] font-black uppercase italic tracking-widest text-black/60">
            <span className="flex items-center gap-1.5 pointer-events-none">
              <Award size={14} /> {posts.length} Posts
            </span>
            <button
              onClick={() => { setFollowModalType("followers"); setIsFollowModalOpen(true); }}
              className="hover:text-black hover:underline transition-all"
            >
              {user.followers?.length || 0} Followers
            </button>
            <button
              onClick={() => { setFollowModalType("following"); setIsFollowModalOpen(true); }}
              className="hover:text-black hover:underline transition-all"
            >
              {user.following?.length || 0} Following
            </button>
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="px-4 py-2 bg-orange-400 border-2 border-black rounded-xl font-semibold hover:bg-orange-300"
        >
          Edit Profile
        </button>
      </div>

      {/* Follow Modal */}
      <FollowModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        title={followModalType === "followers" ? "Followers" : "Following"}
        users={followModalType === "followers" ? user.followers : user.following}
      />
    </div>
  );
};

export default ProfileHeader;
