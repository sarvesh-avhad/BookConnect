import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Award, Trophy, MessageCircle, Star } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";
import ProfileContent from "../../components/profile/ProfileContent";
import FollowModal from "../../components/profile/FollowModal";
import { getUserProfile, followUser, unfollowUser } from "../../services/userService";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const PublicProfile = () => {
    const { id } = useParams();
    const { user: currentUser, updateUser, refreshUser } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Posts");

    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState("followers");

    // Redirect to my profile if it's me
    useEffect(() => {
        if (currentUser?.id === id || currentUser?._id === id) {
            navigate("/profile");
        }
    }, [id, currentUser, navigate]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile(id);
            setProfileUser(data.user);
            setPosts(data.posts);
        } catch (err) {
            console.error("Failed to load profile", err);
            showToast("User not found", "error");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [id]);

    const isFollowing = profileUser?.followers?.some(
        (f) => f._id === currentUser?.id || f._id === currentUser?._id || f === currentUser?.id
    );

    const userFollowsMe = profileUser?.following?.some(
        (f) => f._id === currentUser?.id || f._id === currentUser?._id || f === currentUser?.id
    );

    const isMutual = isFollowing && userFollowsMe;

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(id);
                showToast(`Unfollowed ${profileUser.name}`, "info");
            } else {
                await followUser(id);
                showToast(`Followed ${profileUser.name} ✨`);
            }
            // Update both profile state and current user state
            loadProfile(); 
            refreshUser(); 
        } catch (err) {
            showToast("Operation failed", "error");
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="h-full flex items-center justify-center text-sm opacity-70">
                    Loading profile...
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col">
                {/* Custom Header for Public Profile (with Follow button) */}
                <div className="border-b-2 border-black p-6 bg-[#F5EAD7]">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center text-2xl font-bold">
                            {profileUser.avatar ? (
                                <img src={profileUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                profileUser.name?.charAt(0) || "U"
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">{profileUser.name}</h2>
                                {profileUser.level && (
                                    <div className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase italic rounded-lg flex items-center gap-1">
                                        <Trophy size={10} />
                                        {profileUser.level}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-bold text-black/60 mt-1 uppercase tracking-tight">{profileUser.bio || "Book lover on Book Connect"}</p>

                            {/* Gamification Display */}
                            <div className="mt-6 flex flex-wrap gap-4 items-center bg-[#fff8ef] border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                                        <Star size={14} className="text-orange-500 fill-orange-500" />
                                        Points
                                    </span>
                                    <span className="text-sm font-black uppercase px-3 py-1 bg-orange-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {profileUser.points || 0} XP
                                    </span>
                                </div>

                                {/* Badges */}
                                {profileUser.badges?.length > 0 && (
                                    <div className="flex gap-3 ml-auto">
                                        {profileUser.badges.map((badge, i) => (
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

                            <div className="flex gap-6 mt-4 text-[11px] font-black uppercase italic tracking-widest text-black/60">
                                <span className="flex items-center gap-1.5 pointer-events-none">
                                    <Award size={14} /> {posts.length} Posts
                                </span>
                                <button
                                    onClick={() => { setFollowModalType("followers"); setIsFollowModalOpen(true); }}
                                    className="hover:text-black hover:underline transition-all"
                                >
                                    {profileUser.followers?.length || 0} Followers
                                </button>
                                <button
                                    onClick={() => { setFollowModalType("following"); setIsFollowModalOpen(true); }}
                                    className="hover:text-black hover:underline transition-all"
                                >
                                    {profileUser.following?.length || 0} Following
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {isMutual && (
                                <button
                                    onClick={() => navigate(`/chat/${id}`)}
                                    className="px-4 py-2 bg-black text-white border-2 border-black rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition"
                                >
                                    Message
                                </button>
                            )}
                            <button
                                onClick={handleFollowToggle}
                                className={`px-6 py-2 border-2 border-black rounded-xl font-bold transition
                ${isFollowing
                                        ? "bg-white hover:bg-red-50 text-black"
                                        : "bg-orange-400 hover:bg-orange-300 text-black"}`}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </div>
                </div>

                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="flex-1 overflow-y-auto">
                    <ProfileContent activeTab={activeTab} posts={posts} />
                </div>

                {/* Follow Modal */}
                <FollowModal
                    isOpen={isFollowModalOpen}
                    onClose={() => setIsFollowModalOpen(false)}
                    title={followModalType === "followers" ? "Followers" : "Following"}
                    users={followModalType === "followers" ? profileUser.followers : profileUser.following}
                />
            </div>
        </DashboardLayout>
    );
};

export default PublicProfile;
