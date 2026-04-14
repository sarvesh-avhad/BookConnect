import Logo from "../../assets/images/Logo.png";
import { House, Telescope, Repeat2, UserRound, LogOut, Info, MessageSquare } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import NotificationsPanel from "./NotificationsPanel";

const Sidebar = () => {
  const linkBase =
    "w-full flex items-center gap-3 py-2.5 px-3 rounded-2xl transition";

  const activeGlow = "bg-orange-400/40 shadow-[0_0_20px_rgba(255,106,43,0.3)]";
  const hoverSoft = "hover:bg-black/5";

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-52 bg-[#F5EAD7] flex flex-col py-6 h-full">
      {/* Logo */}
      <div className="px-5 mb-8 mt-4 flex items-center justify-center">
        <img src={Logo} alt="Logo" className="w-16 h-16 drop-shadow-md hover:scale-105 transition-transform" />
      </div>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="w-10 h-10 rounded-2xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center text-lg font-bold flex-shrink-0">
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
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-black truncate">
              {user.name}
            </span>
            <span className="text-[9px] text-black/50 truncate uppercase tracking-wider">
              Profile
            </span>
          </div>
        </div>
      )}

      {/* Links */}
      <nav className="flex flex-col gap-4 w-full px-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeGlow : hoverSoft}`
          }
        >
          <House size={20} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Home</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeGlow : hoverSoft}`
          }
        >
          <Telescope size={20} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Explore</span>
        </NavLink>

        <NavLink
          to="/exchange"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeGlow : hoverSoft}`
          }
        >
          <Repeat2 size={20} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Exchange</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeGlow : hoverSoft}`
          }
        >
          <MessageSquare size={20} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Messages</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeGlow : hoverSoft}`
          }
        >
          <UserRound size={20} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Profile</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeGlow : hoverSoft}`
          }
        >
          <Info size={20} className="text-black" />
          <span className="text-[13px] font-semibold text-black">About</span>
        </NavLink>
      </nav>

      {/* Bottom: Notifications + Logout */}
      <div className="mt-auto mb-6 w-full px-2 flex flex-col gap-1.5">
        <NotificationsPanel />
        <button onClick={handleLogout} className={`${linkBase} ${hoverSoft}`}>
          <LogOut size={18} className="text-black" />
          <span className="text-[13px] font-semibold text-black">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
