import { useContext, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../services/authService";
import { uploadImage } from "../../services/uploadService";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalAvatarUrl = user?.avatar || "";
      if (avatarFile) {
        finalAvatarUrl = await uploadImage(avatarFile);
      } else if (!avatarPreview) {
        finalAvatarUrl = ""; // cleared avatar
      }

      const updatedUser = await updateProfile({
        name,
        bio,
        avatar: finalAvatarUrl,
      });

      // update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // update context
      setUser(updatedUser);

      navigate("/profile");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#FFF7E6] border-2 border-black rounded-2xl p-6 space-y-4"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative w-24 h-24 rounded-2xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center text-2xl font-bold group">
              {avatarPreview ? (
                <>
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setAvatarFile(null); setAvatarPreview(""); }}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={24} />
                  </button>
                </>
              ) : (
                <span className="opacity-50 text-sm uppercase">No Image</span>
              )}
            </div>
            <label className="cursor-pointer bg-white border-2 border-black rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#F5EAD7] transition shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <Upload size={14} /> Upload New Avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-black rounded-xl p-2"
          />

          {/* Bio */}
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border-2 border-black rounded-xl p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 border-2 border-black rounded-xl p-2 font-bold hover:bg-orange-300 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;
