import PostCard from "../social/PostCard";
import { Bookmark, BookOpen } from "lucide-react";

const ProfileContent = ({ activeTab, posts = [], savedPosts = [] }) => {
  if (activeTab === "Posts") {
    return (
      <div className="p-6 flex flex-col gap-6 items-center">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-3 text-black/50">
            <BookOpen size={48} strokeWidth={1.2} />
            <p className="text-base font-semibold">No posts yet</p>
            <p className="text-sm">Share your first book!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    );
  }

  if (activeTab === "Saved") {
    return (
      <div className="p-6 flex flex-col gap-6 items-center">
        {savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-3 text-black/50">
            <Bookmark size={48} strokeWidth={1.2} />
            <p className="text-base font-semibold">No saved posts yet</p>
            <p className="text-sm">Bookmark posts to find them here.</p>
          </div>
        ) : (
          savedPosts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    );
  }

  return null;
};

export default ProfileContent;
