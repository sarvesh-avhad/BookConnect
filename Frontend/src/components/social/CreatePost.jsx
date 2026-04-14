import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createPost } from "../../services/postService";
import { searchBooks, getBookDetails } from "../../services/bookService";
import { uploadImage } from "../../services/uploadService";
import { MessageSquare, Book as BookIcon, Search, X, Check, Upload } from "lucide-react";
import { useGamification } from "../../context/GamificationContext";

const CreatePost = ({ onPostCreated }) => {
  const { showPointsAwarded } = useGamification();
  const location = useLocation();
  const isExchangePage = location.pathname === "/exchange";
  const isHomePage = location.pathname === "/";

  const [activeTab, setActiveTab] = useState(isExchangePage ? "book" : "thought");
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [exchangeAvailable, setExchangeAvailable] = useState(isExchangePage);
  const [category, setCategory] = useState("Fiction");
  const [condition, setCondition] = useState("Like New");
  const [maxDuration, setMaxDuration] = useState("2 weeks");
  const [uploading, setUploading] = useState(false);

  // Book specific states
  const [bookQuery, setBookQuery] = useState("");
  const [bookResults, setBookResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);

  useEffect(() => {
    if (isExchangePage) {
      setActiveTab("book");
      setExchangeAvailable(true);
    }
    else if (isHomePage) {
      setActiveTab("thought");
      setExchangeAvailable(false);
    }
  }, [location.pathname]);

  // Sync exchangeAvailable with activeTab
  useEffect(() => {
    if (activeTab === "book") setExchangeAvailable(true);
    if (activeTab === "thought") setExchangeAvailable(false);
  }, [activeTab]);

  const handleBookSearch = async () => {
    if (!bookQuery.trim()) return;
    try {
      setSearching(true);
      const results = await searchBooks(bookQuery);
      setBookResults(results || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBook = async (bookInfo) => {
    try {
      setLoadingBook(true);
      const data = await getBookDetails(bookInfo);
      setSelectedBook(data.book);
      setBookResults([]);
      setBookQuery("");
      // Auto-set category if available
      if (data.book.categories?.length > 0) {
        setCategory(data.book.categories[0]);
      }
    } catch (err) {
      console.error("Failed to select book", err);
    } finally {
      setLoadingBook(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "thought" && !caption) {
      return alert("Please provide a caption.");
    }
    if (activeTab === "book" && (!caption || !selectedBook)) {
      return alert("Please select a book and write a caption.");
    }

    try {
      setUploading(true);
      let imageUrl = "";

      if (activeTab === "thought" && imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (activeTab === "book") {
        imageUrl = selectedBook.thumbnail || "";
      }

      await createPost({
        caption,
        image: imageUrl,
        exchangeAvailable,
        category,
        bookId: activeTab === "book" ? selectedBook._id : null,
        condition: activeTab === "book" ? condition : null,
        maxDuration: activeTab === "book" ? maxDuration : null,
      });

      // clear form
      setCaption("");
      setImageFile(null);
      setImagePreview("");
      setExchangeAvailable(false);
      setCategory("Fiction");
      setSelectedBook(null);
      setBookQuery("");

      if (onPostCreated) {
        onPostCreated();
      }

      // Award 5 points animation
      // showPointsAwarded(5);
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-[#FFF7E6] border-2 border-black rounded-2xl overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
      {/* Tabs - Only show if both options are relevant (optional) or filter based on page */}
      {(!isHomePage && !isExchangePage) && (
        <div className="flex bg-black/5 p-1 border-b-2 border-black">
          <button
            onClick={() => {
              setActiveTab("thought");
              setSelectedBook(null);
            }}
            className={`flex-1 py-1.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
              ${activeTab === "thought" ? "bg-black text-white" : "text-black/40 hover:text-black/60"}`}
          >
            <MessageSquare size={12} /> Share Thought
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("book");
              setImageFile(null);
              setImagePreview("");
            }}
            className={`flex-1 py-1.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
              ${activeTab === "book" ? "bg-black text-white" : "text-black/40 hover:text-black/60"}`}
          >
            <BookIcon size={12} /> Post a Book
          </button>
        </div>
      )}

      {/* If on Home or Exchange, show a simple header or nothing */}
      {(isHomePage || isExchangePage) && (
        <div className="py-3 px-4 border-b-2 border-black/10 bg-[#FFD9A0]/30 flex items-center gap-2 text-[10px] font-black uppercase italic tracking-wider">
          {isHomePage ? (
            <><MessageSquare size={14} /> Share Thought</>
          ) : (
            <><BookIcon size={14} /> Post a Book</>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4">
        {activeTab === "thought" ? (
          <div className="space-y-3">
            {!imagePreview ? (
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-black rounded-xl p-8 bg-white cursor-pointer hover:bg-black/5 transition-colors">
                <Upload size={24} className="mb-2 opacity-50" />
                <span className="text-sm font-bold opacity-50 uppercase tracking-tight">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative border-2 border-black rounded-xl overflow-hidden bg-black/5">
                <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-contain" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {!selectedBook ? (
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search global library..."
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleBookSearch())}
                    className="flex-1 border-2 border-black rounded-xl p-3 text-sm bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleBookSearch}
                    disabled={searching}
                    className="bg-black text-white px-3 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    {searching ? "..." : <Search size={16} />}
                  </button>
                </div>

                {bookResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                    {bookResults.map((b) => (
                      <div
                        key={b.googleBooksId}
                        onClick={() => handleSelectBook(b)}
                        className="p-3 border-b last:border-0 hover:bg-[#F5EAD7] cursor-pointer flex gap-3 transition-colors"
                      >
                        <img src={b.thumbnail} className="w-10 h-14 object-cover border border-black" alt="" />
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold truncate">{b.title}</p>
                          <p className="text-xs opacity-60 truncate">{b.authors?.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2 border-2 border-black bg-[#FFD9A0]/20 rounded-xl relative group">
                <img src={selectedBook.thumbnail} className="w-10 h-14 object-cover border-2 border-black" alt="" />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-green-600" />
                    <p className="text-[11px] font-black truncate uppercase italic">{selectedBook.title}</p>
                  </div>
                  <p className="text-[10px] opacity-60 truncate uppercase font-bold">{selectedBook.authors?.join(", ")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="p-1 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}

        <textarea
          placeholder={activeTab === "thought" ? "What's on your mind?" : "Why are you sharing this book?"}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border-2 border-black rounded-xl p-3 my-3 text-sm min-h-[100px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none"
          required
        />

        <div className="flex gap-3 mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border-2 border-black rounded-xl p-2 text-sm font-bold bg-white"
          >
            <option>Fiction</option>
            <option>Self-Help</option>
            <option>Fantasy</option>
            <option>Academic</option>
            <option>Programming</option>
            <option>Manga</option>
            <option>History</option>
            <option>Biography</option>
          </select>

          <label className="flex-1 flex items-center justify-center gap-2 border-2 border-black rounded-xl p-2 bg-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exchangeAvailable}
              onChange={(e) => setExchangeAvailable(e.target.checked)}
              className="accent-black"
            />
            <span className="text-xs font-bold uppercase tracking-tighter">Exchange?</span>
          </label>
        </div>

        {activeTab === "book" && (
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase mb-1 block opacity-40">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full border-2 border-black rounded-xl p-2 text-xs font-bold bg-white"
              >
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase mb-1 block opacity-40">Duration</label>
              <select
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                className="w-full border-2 border-black rounded-xl p-2 text-xs font-bold bg-white"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>Flexible</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-orange-400 border-2 border-black rounded-xl py-2.5 font-bold text-black uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:shadow-none transition shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : loadingBook ? "Selecting Book..." : activeTab === "thought" ? "Post Thought" : "Share Book"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
