const TopSearchBar = ({ search, setSearch }) => {
  return (
    <div className="bg-[#FFC107] border-b-2 border-black p-4 w-full h-24 flex items-center font-bold text-lg">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for books, authors, readers, genres..."
        className="w-1/2 h-15 bg-amber-100 px-4 border-2 border-black focus:outline-none"
      />
    </div>
  );
};

export default TopSearchBar;
