const BookCard = ({ book, onClick }) => {
  const isGlobal = !!book.googleBooksId;
  const image = isGlobal ? book.thumbnail : book.image;
  const title = isGlobal ? book.title : book.caption;
  const subtitle = isGlobal ? book.authors?.join(", ") : (book.user?.name || "");

  return (
    <div
      onClick={onClick}
      className="border-2 border-black rounded-2xl overflow-hidden bg-[#FFF7E6] cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/300x400?text=No+Cover"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isGlobal && book.averageRating > 0 && (
          <div className="absolute top-2 right-2 bg-black text-[#FFD9A0] text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
            ★ {book.averageRating}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm truncate group-hover:text-orange-600 transition-colors">
          {title}
        </h3>

        <p className="text-xs text-black/60 truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
