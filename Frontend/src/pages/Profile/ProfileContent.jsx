import { useEffect, useState } from "react";
import { getMyPosts } from "../../services/postService";
import PostCard from "../social/PostCard";

const ProfileContent = ({ activeTab }) => {
  const [posts, setPosts] = useState([]);
console.log("ProfileContent rendered");

 useEffect(() => {
  console.log("useEffect triggered");

  const loadPosts = async () => {
    console.log("Fetching posts...");

    try {
      const data = await getMyPosts();
      console.log("My posts:", data);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  loadPosts();
}, []);


  if (activeTab !== "Posts") return null;

  return (
    <div className="p-6 flex flex-col gap-6 items-center">
      {posts.length === 0 ? (
        <p className="text-black/60">No posts yet</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </div>
  );
};

export default ProfileContent;
