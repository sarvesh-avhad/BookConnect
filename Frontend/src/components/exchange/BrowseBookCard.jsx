import { BookOpen } from "lucide-react";

const BrowseBookCard = ({ post, onRequest }) => {
  return (
    <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
      <div className="p-5 flex flex-1 gap-5">
        {/* Book Jacket */}
        <div className="w-24 h-36 bg-[#F3DFC8] border-2 border-black rounded-2xl overflow-hidden flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <img 
            src={post.image || post.book?.thumbnail} 
            alt="book" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1">
            <h3 className="font-black text-lg text-black leading-tight truncate mb-0.5">
              {post.book?.title}
            </h3>
            <p className="text-[11px] font-bold text-black/50 uppercase tracking-wide truncate mb-2">
              {post.book?.authors?.join(", ")}
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-tighter mb-4">
              {post.book?.categories?.[0] || "Fiction"}
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full border border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold text-[8px]">
                {post.user?.avatar ? <img src={post.user.avatar} className="w-full h-full object-cover" /> : post.user?.name?.charAt(0)}
              </div>
              <span className="text-[10px] font-bold text-black/70">{post.user?.name}</span>
            </div>
          </div>

          <p className="text-xs text-black/60 italic leading-relaxed line-clamp-2 mt-auto">
            "{post.caption}"
          </p>
        </div>
      </div>

      <button
        onClick={() => onRequest(post)}
        className="w-full py-4 bg-orange-500 border-t-2 border-black font-black uppercase italic tracking-widest text-[11px] text-white hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        <BookOpen size={16} /> Request to Borrow
      </button>
    </div>
  );
};

export default BrowseBookCard;
