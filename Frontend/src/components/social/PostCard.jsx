import { Heart, MessageCircle, Bookmark, UserPlus, UserCheck, X } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike, deletePost, toggleSave } from "../../services/postService";
import { requestExchange } from "../../services/exchangeService";
import { followUser, unfollowUser } from "../../services/userService";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import CommentSection from "./CommentSection";

/* ---------- Time helper ---------- */
const timeAgo = (date) => {
  if (!date) return "Just now";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

/* ---------- Component ---------- */
const PostCard = ({ post, onDelete }) => {
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useToast();

  // safety guard
  if (!post || !user) return null;

  const currentUserId = user.id || user._id;
  const postUserId = post.user?._id || post.user?.id || post.user;

  const isOwner = currentUserId && postUserId && String(postUserId) === String(currentUserId);
  const isFollowing = user.following?.some(
    (f) => {
      const followingId = f._id || f.id || f;
      return String(followingId) === String(postUserId);
    }
  );

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(
    post.likes?.includes(user.id) || post.likes?.includes(user._id) || false,
  );
  const [saved, setSaved] = useState(post.savedByUser || false);
  const [animate, setAnimate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [requested, setRequested] = useState(post.requestedByUser || false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  /* ---------- Like ---------- */
  const handleLike = async () => {
    try {
      const res = await toggleLike(post._id);
      setLikes(res.likes);
      setLiked(res.liked);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
      if (res.liked) showToast("Post liked! ❤️");
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  /* ---------- Bookmark ---------- */
  const handleSave = async () => {
    try {
      const res = await toggleSave(post._id);
      setSaved(res.saved);
      showToast(res.saved ? "Post saved! 🔖" : "Post unsaved", res.saved ? "success" : "info");
    } catch (err) {
      console.error("Save failed", err);
      showToast("Failed to save post", "error");
    }
  };

  /* ---------- Follow Toggle ---------- */
  const handleFollowToggle = async () => {
    if (followLoading) return;
    try {
      setFollowLoading(true);
      const targetId = post.user?._id || post.user?.id;

      if (isFollowing) {
        await unfollowUser(targetId);
        updateUser({
          ...user,
          following: user.following.filter((f) => {
            const fId = f._id || f.id || f;
            return String(fId) !== String(targetId);
          }),
        });
        showToast("Unfollowed", "info");
      } else {
        await followUser(targetId);
        updateUser({
          ...user,
          following: [...(user.following || []), targetId],
        });
        showToast("Following! ✨");
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
      showToast("Action failed", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  /* ---------- Exchange ---------- */
  const handleExchangeRequest = async () => {
    try {
      await requestExchange(post._id);
      setRequested(true);
      showToast("Exchange requested! 📚");
    } catch (err) {
      const msg = err.response?.data?.message || "Exchange request failed";
      showToast(msg, "error");
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id);
      if (onDelete) onDelete(post._id);
      showToast("Post deleted", "info");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete post", "error");
    }
  };

  /* ---------- Comment submitted ---------- */
  const handleCommentAdded = () => {
    setCommentCount((c) => c + 1);
  };

  return (
    <div className="w-full max-w-xl border-2 border-black bg-[#FFF7E6] rounded-2xl p-4">
      {/* ---------- Header ---------- */}
      <div className="flex items-center gap-3">
        <Link
          to={isOwner ? "/profile" : `/profile/${post.user?._id || post.user?.id}`}
          className="w-11 h-11 rounded-xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold hover:opacity-80 transition"
        >
          {post.user?.avatar ? (
            <img src={post.user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            post.user?.name?.charAt(0) || "U"
          )}
        </Link>

        <div className="flex-1">
          <Link
            to={isOwner ? "/profile" : `/profile/${post.user?._id || post.user?.id}`}
            className="font-bold text-sm hover:underline"
          >
            {post.user?.name || "Unknown"}
          </Link>
          <p className="text-xs opacity-70">{timeAgo(post.createdAt)}</p>
        </div>

        {!isOwner && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-2 border-black rounded-xl transition-all active:scale-95
              ${isFollowing
                ? "bg-gray-200 text-black hover:bg-gray-300"
                : "bg-blue-400 text-white hover:bg-blue-300"
              }
              ${followLoading ? "opacity-50 cursor-wait" : ""}
            `}
          >
            {isFollowing ? (
              <>
                <UserCheck size={14} />
                Following
              </>
            ) : (
              <>
                <UserPlus size={14} />
                Follow
              </>
            )}
          </button>
        )}

        {isOwner && (
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-xs font-semibold text-white bg-red-500 border-2 border-black rounded-xl hover:bg-red-400 transition"
          >
            Delete
          </button>
        )}
      </div>

      {/* ---------- Caption ---------- */}
      <p className="mt-4 text-sm leading-relaxed text-[#3A2E2A]">{post.caption}</p>

      {/* ---------- Image + Actions ---------- */}
      {(post.image || post.book) && (
        <>
          <div 
            onClick={() => setShowLightbox(true)}
            className="mt-4 relative border-2 border-black rounded-2xl overflow-hidden bg-[#F3DFC8] cursor-zoom-in group"
          >
            {post.exchangeAvailable && (
              <span className="absolute top-3 left-3 px-3 py-1 text-[11px] rounded-full bg-[#FFF7E6]/80 border border-black/20 z-10 font-bold">
                Exchange Available
              </span>
            )}

            {animate && (
              <Heart
                size={80}
                className="absolute inset-0 m-auto text-red-500 opacity-80 animate-ping pointer-events-none z-10"
              />
            )}

            <img
              src={post.image || post.book?.thumbnail}
              alt="Post"
              className="w-full h-auto max-h-[400px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {post.book && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white border-t border-white/10">
                <p className="text-xs font-bold truncate leading-tight">{post.book.title}</p>
                <p className="text-[10px] opacity-80 truncate">{post.book.authors?.join(", ")}</p>
                {post.book.averageRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`text-[8px] ${s <= Math.round(post.book.averageRating) ? "text-orange-400" : "text-white/20"}`}>★</span>
                      ))}
                    </div>
                    <span className="text-[9px] font-bold opacity-60">({post.book.averageRating})</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lightbox Overlay */}
          {showLightbox && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <button 
                onClick={() => setShowLightbox(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X size={28} />
              </button>
              
              <img
                src={post.image || post.book?.thumbnail}
                alt="Full post view"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              />
            </div>
          )}
        </>
      )}

      {/* ---------- Action Bar ---------- */}
      <div className="mt-3 flex items-center justify-between border-b border-black/5 pb-1">
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-95
              ${liked ? "text-red-500 bg-red-50" : "text-black/60 hover:text-black hover:bg-black/5"}`}
          >
            <Heart
              size={20}
              className={liked ? "fill-red-500" : ""}
            />
            <span className="text-xs font-bold">{likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-black/60 hover:text-black hover:bg-black/5 transition-all"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-bold">{commentCount}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleSave}
          className={`p-2 rounded-xl transition-all
            ${saved ? "text-orange-500 bg-orange-50" : "text-black/60 hover:text-black hover:bg-black/5"}`}
        >
          <Bookmark
            size={20}
            className={saved ? "fill-orange-500" : ""}
          />
        </button>
      </div>

      {/* ---------- Exchange Button ---------- */}
      {post.exchangeAvailable && !isOwner && !requested && (
        <div className="mt-3">
          <button
            onClick={handleExchangeRequest}
            disabled={requested}
            className={`w-full border-2 border-black rounded-xl py-2 font-semibold transition
              ${requested
                ? "bg-gray-300 text-black/60 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-300"
              }`}
          >
            {requested ? "Request Sent" : "Request Exchange"}
          </button>
        </div>
      )}

      {/* ---------- Comments ---------- */}
      {showComments && (
        <CommentSection postId={post._id} onCommentAdded={handleCommentAdded} />
      )}
    </div>
  );
};

export default PostCard;
