const TrendingBooks = () => {
  const books = [
    "Atomic Habits",
    "The Alchemist",
    "Ikigai",
    "Rich Dad Poor Dad",
  ];

  return (
    <div className="border-2 border-black/70 bg-[#FFF8EC] rounded-2xl p-4">
      <h3 className="text-sm font-bold text-black mb-3">
        Trending Books
      </h3>

      <ul className="flex flex-col divide-y divide-black/20">
        {books.map((book, index) => (
          <li
            key={index}
            className="py-3 flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-black">
              {index + 1}. {book}
            </span>

            <span className="text-xs text-black/50">
              🔥
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingBooks;
