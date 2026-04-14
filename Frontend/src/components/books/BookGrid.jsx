import BookCard from "./BookCard";

const BookGrid = ({ books = [] }) => {
  if (!books.length) {
    return (
      <div className="text-center text-black/60 py-10">
        No books found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
