import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import BookCard from "../../components/books/BookCard";
import BookDetails from "../../components/books/BookDetails";
import { getPosts } from "../../services/postService";
import { searchBooks } from "../../services/bookService";
import { Telescope, BookOpen, Globe, Search } from "lucide-react";

const categories = [
  "All",
  "Fiction",
  "Self-Help",
  "Fantasy",
  "Academic",
  "Programming",
  "Manga",
];

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [globalBooks, setGlobalBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("local"); // 'local' or 'global'
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data || []);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    };
    if (searchType === "local") {
      loadPosts();
    }
  }, [searchType]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    if (searchType === "global") {
      try {
        setSearching(true);
        const results = await searchBooks(search);
        setGlobalBooks(results);
      } catch (err) {
        console.error("Global search failed", err);
      } finally {
        setSearching(false);
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    const caption = post.caption?.toLowerCase() || "";
    const category = post.category || "All";
    const matchesSearch = caption.includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Search Bar with Type Toggle */}
        <div className="flex flex-col border-b-2 border-black">
          <div className="flex bg-[#F5EAD7] p-2 gap-2 border-b-2 border-black/10">
            <button
              onClick={() => setSearchType("local")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black transition-all
                ${searchType === "local" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
            >
              <BookOpen size={14} /> Local Feed
            </button>
            <button
              onClick={() => setSearchType("global")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black transition-all
                ${searchType === "global" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
            >
              <Globe size={14} /> Search Global Books
            </button>
          </div>

          <div className="flex bg-[#FFC107] py-3 px-4 gap-4 items-center h-20 border-t-2 border-black">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={searchType === "local" ? "Search for local posts..." : "Type book title and press Enter..."}
              className="flex-1 h-12 bg-amber-100 px-6 border-2 border-black focus:outline-none font-bold placeholder:text-black/30"
            />
            {searchType === "global" && (
              <button
                onClick={handleSearch}
                className="h-12 px-6 bg-black text-white font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors"
                disabled={searching}
              >
                {searching ? "..." : <Search size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Category Filters (Local Only) */}
          {searchType === "local" && (
            <div className="p-4 border-b-2 border-black/70 bg-[#F5EAD7]/50">
              <div className="flex gap-3 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm font-semibold border-2 border-black rounded-full transition
                      ${activeCategory === cat ? "bg-[#FFD9A0] scale-105" : "bg-[#FFF7E6] hover:bg-[#FFD9A0]/60"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result Grid */}
          <div className="p-6">
            {loading || searching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse rounded-2xl border-2 border-black/10" />
                ))}
              </div>
            ) : (searchType === "local" ? filteredPosts : globalBooks).length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 gap-4 text-black/50">
                <Telescope size={56} strokeWidth={1.2} />
                <p className="text-lg font-semibold">
                  {searchType === "local" ? "Nothing found locally" : "Start your global book hunt"}
                </p>
                <p className="text-sm text-center">
                  {searchType === "local" ? "Try a different search or category." : "Type a title or author above to search the world's library."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(searchType === "local" ? filteredPosts : globalBooks).map((item) => (
                  <BookCard
                    key={item._id || item.googleBooksId}
                    book={item}
                    onClick={() => setSelectedBook(searchType === "local" ? item.book : item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {selectedBook && (
          <BookDetails
            bookInfo={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Explore;
