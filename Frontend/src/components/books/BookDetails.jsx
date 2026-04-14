import { useState, useEffect } from "react";
import { Star, X, MessageSquare, Book as BookIcon } from "lucide-react";
import { getBookDetails, addReview } from "../../services/bookService";

const BookDetails = ({ bookInfo, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getBookDetails(bookInfo);
                setBook(data.book);
                setReviews(data.reviews || []);
            } catch (err) {
                console.error("Failed to load book details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [bookInfo]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            if (!book?._id) {
                alert("Book information not fully loaded. Please wait a moment.");
                return;
            }
            setSubmitting(true);
            const newReview = await addReview(book._id, { rating, comment });
            setReviews((prev) => [newReview, ...prev]);
            setComment("");
            // Update local book average rating if needed, or re-fetch
            setBook(prev => ({
                ...prev,
                averageRating: ((prev.averageRating * prev.totalReviews + rating) / (prev.totalReviews + 1)).toFixed(1),
                totalReviews: prev.totalReviews + 1
            }));
        } catch (err) {
            alert("Failed to post review. Please make sure you are logged in.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!bookInfo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#FFF7E6] border-4 border-black w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[8px_8px_0px_rgba(0,0,0,1)]">

                {/* Close Button Mobile */}
                <div className="md:hidden absolute top-6 right-6 p-2 bg-black text-white rounded-full z-10 cursor-pointer" onClick={onClose}>
                    <X size={20} />
                </div>

                {/* Book Cover Area */}
                <div className="w-full md:w-1/3 bg-[#FFD9A0] p-8 flex flex-col items-center border-b-4 md:border-b-0 md:border-r-4 border-black overflow-y-auto">
                    <img
                        src={bookInfo.thumbnail || "https://via.placeholder.com/300x450?text=No+Cover"}
                        alt={bookInfo.title}
                        className="w-48 h-72 object-cover border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6"
                    />
                    <div className="w-full space-y-4">
                        <h2 className="vintage-font text-2xl text-center leading-tight">
                            {bookInfo.title}
                        </h2>
                        <p className="text-center font-bold text-black/70">
                            {bookInfo.authors?.join(", ")}
                        </p>
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={20}
                                    fill={s <= (book?.averageRating || 0) ? "black" : "transparent"}
                                    className={s <= (book?.averageRating || 0) ? "text-black" : "text-black/20"}
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-widest opacity-60">
                            {book?.totalReviews || 0} Reviews • {bookInfo.pageCount || "?"} Pages
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="hidden md:flex mt-auto items-center gap-2 px-6 py-2 bg-black text-white font-bold hover:bg-orange-600 transition-colors uppercase tracking-widest text-xs"
                    >
                        <X size={16} /> Close Details
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F5EAD7]/30">
                    <div className="mb-10">
                        <h3 className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
                            Description
                        </h3>
                        <p className="text-sm leading-relaxed text-black/80 font-medium">
                            {bookInfo.description ?
                                (bookInfo.description.replace(/<[^>]*>?/gm, '')) :
                                "No description available for this book."}
                        </p>
                    </div>

                    <div className="mb-10">
                        <h3 className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-6">
                            Reviews & Thoughts
                        </h3>

                        {/* Review Form */}
                        <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border-2 border-black bg-white">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-bold uppercase">Your Rating:</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={24}
                                                fill={s <= rating ? "black" : "transparent"}
                                                className={s <= rating ? "text-black" : "text-black/20"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts on this book..."
                                className="w-full p-3 border-2 border-black text-sm min-h-[100px] focus:outline-none focus:bg-[#FFF7E6] transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-3 w-full py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Posting..." : "Post Review"}
                            </button>
                        </form>

                        {/* Review List */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex flex-col items-center py-10 opacity-30">
                                    <Star size={40} className="animate-spin mb-4" />
                                    <p className="font-bold">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-10 border-2 border-black border-dashed opacity-50">
                                    <MessageSquare size={32} className="mx-auto mb-2" />
                                    <p className="text-sm font-bold">No reviews yet. Be the first!</p>
                                </div>
                            ) : (
                                reviews.map((rev) => (
                                    <div key={rev._id} className="border-b-2 border-black/10 pb-6 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <img src={rev.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg"} className="w-8 h-8 rounded-full border border-black" alt={rev.user?.name} />
                                                <span className="text-sm font-bold">{rev.user?.name}</span>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={12} fill={s <= rev.rating ? "black" : "transparent"} className="text-black" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-black/70 italic">"{rev.comment}"</p>
                                        <p className="text-[10px] mt-2 font-bold uppercase opacity-40">
                                            {new Date(rev.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
