import DashboardLayout from "../../layouts/DashboardLayout";
import { BookOpen, Repeat2, Heart, Search, Star } from "lucide-react";

const features = [
  {
    icon: <BookOpen size={28} className="text-orange-500" />,
    title: "Share Books",
    desc: "Post the books you've read, loved, or want to pass on to others.",
  },
  {
    icon: <Repeat2 size={28} className="text-orange-500" />,
    title: "Exchange",
    desc: "Request book exchanges directly with other readers in the community.",
  },
  {
    icon: <Heart size={28} className="text-orange-500" />,
    title: "Like & Comment",
    desc: "Engage with the community — like posts and leave comments.",
  },
  {
    icon: <Search size={28} className="text-orange-500" />,
    title: "Explore",
    desc: "Browse books by category: Fiction, Fantasy, Self-Help, Manga, and more.",
  },
  {
    icon: <Star size={28} className="text-orange-500" />,
    title: "Bookmarks",
    desc: "Save posts you love and revisit them anytime from your profile.",
  },
];

const techStack = [
  { label: "Frontend", value: "React + Vite + TailwindCSS" },
  { label: "Backend", value: "Node.js + Express" },
  { label: "Database", value: "MongoDB + Mongoose" },
  { label: "Auth", value: "JWT + bcrypt" },
];

const About = () => {
  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto">
        {/* Hero */}
        <div className="p-8 border-b-2 border-black/60 bg-[#F5EAD7]">
          <h1 className="vintage-font text-5xl tracking-[0.15em] uppercase text-black [text-shadow:1px_1px_0_#fff,2px_2px_0_rgba(0,0,0,0.2)]">
            Book Connect
          </h1>
          <p className="mt-3 text-base font-semibold text-black/70 max-w-lg">
            A social platform for book lovers — share what you're reading, exchange
            books with others, and discover your next great read.
          </p>
        </div>

        {/* Features */}
        <div className="p-8 border-b-2 border-black/20">
          <h2 className="text-xl font-bold mb-6">What you can do</h2>
          <div className="grid grid-cols-1 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 items-start bg-[#FFF7E6] border-2 border-black rounded-2xl p-4"
              >
                <div className="mt-0.5">{f.icon}</div>
                <div>
                  <p className="font-bold text-sm">{f.title}</p>
                  <p className="text-sm text-black/60 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="p-8 border-b-2 border-black/20">
          <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 gap-3">
            {techStack.map((t) => (
              <div
                key={t.label}
                className="bg-[#FFF7E6] border-2 border-black rounded-2xl px-4 py-3"
              >
                <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">
                  {t.label}
                </p>
                <p className="text-sm font-semibold mt-1">{t.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center text-sm text-black/40">
          <p>Built with ❤️ for book lovers everywhere.</p>
          <p className="mt-1 text-xs">Book Connect © {new Date().getFullYear()} · BETA</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default About;
