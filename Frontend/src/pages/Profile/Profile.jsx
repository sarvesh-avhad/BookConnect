import { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";
import ProfileContent from "../../components/profile/ProfileContent";
import { AuthContext } from "../../context/AuthContext";
import { getMyPosts, getSavedPosts } from "../../services/postService";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Posts");
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const loadUserPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load user posts");
    }
  };

  const loadSavedPosts = async () => {
    try {
      const data = await getSavedPosts();
      setSavedPosts(data);
    } catch (err) {
      console.error("Failed to load saved posts");
    }
  };

  useEffect(() => {
    if (user) {
      loadUserPosts();
      loadSavedPosts();
    }
  }, [user]);

  // Loading state
  if (!user) {
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
        <ProfileHeader user={user} posts={posts} />

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 overflow-y-auto">
          <ProfileContent
            activeTab={activeTab}
            posts={posts}
            savedPosts={savedPosts}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
