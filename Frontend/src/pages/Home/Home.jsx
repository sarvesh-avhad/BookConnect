import PostCard from "../../components/social/PostCard";
import PostSkeleton from "../../components/ui/PostSkeleton";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getPosts, getFollowingPosts } from "../../services/postService";
import { Globe, Users, BookOpen } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedTab, setFeedTab] = useState("global"); // 'global' or 'following'

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = feedTab === "global" ? await getPosts() : await getFollowingPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [feedTab]);

  return (
    <DashboardLayout onPostCreated={loadPosts}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="py-4 px-6 border-b-2 bg-[#F5EAD7]/50">
          <div className="flex items-end gap-3">
            <h1 className="vintage-font text-3xl tracking-[0.15em] uppercase text-black [text-shadow:1px_1px_0_#ffffff,2px_2px_0_rgba(0,0,0,0.25)]">
              Book Connect
            </h1>
            <span className="mb-1 px-2 py-0.5 text-[9px] font-bold border-2 border-black rounded-full bg-white">
              BETA
            </span>
          </div>
          <p className="ml-1 mt-1 text-[10px] tracking-[0.2em] uppercase opacity-70 font-semibold">
            Read • Share • Exchange
          </p>
        </div>

        {/* Feed Tabs - Segmented Control */}
        <div className="px-6 py-3 border-b-2 border-black/5 flex justify-center">
          <div className="bg-black/5 p-1 rounded-2xl flex gap-1 w-full max-w-[280px] relative">
            {/* Sliding Background */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 
                ${feedTab === "global" ? "left-1" : "left-[calc(50%+1px)]"}`}
            />

            <button
              onClick={() => setFeedTab("global")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 z-10 
                ${feedTab === "global" ? "text-black" : "text-black/40 hover:text-black/60"}`}
            >
              <Globe size={16} className={feedTab === "global" ? "text-orange-500" : ""} />
              Global
            </button>

            <button
              onClick={() => setFeedTab("following")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 z-10 
                ${feedTab === "following" ? "text-black" : "text-black/40 hover:text-black/60"}`}
            >
              <Users size={16} className={feedTab === "following" ? "text-orange-500" : ""} />
              Following
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col gap-6 items-center overflow-y-auto">
          {loading ? (
            [1, 2, 3].map((i) => <PostSkeleton key={i} />)
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 gap-4 text-black/50">
              {feedTab === "global" ? <BookOpen size={56} strokeWidth={1.2} /> : <Users size={56} strokeWidth={1.2} />}
              <p className="text-lg font-semibold">
                {feedTab === "global" ? "No posts yet" : "Your feed is empty"}
              </p>
              <p className="text-sm text-center max-w-xs">
                {feedTab === "global"
                  ? "Be the first to share a book! Head to your profile to create a post."
                  : "Follow other readers from the 'Explore' or 'Who to follow' section to see their posts here."}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
