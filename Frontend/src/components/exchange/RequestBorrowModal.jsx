import { useState } from "react";
import { X, Send, Clock, BookOpen } from "lucide-react";

const RequestBorrowModal = ({ post, onClose, onSuccess }) => {
  const [proposedDuration, setProposedDuration] = useState("2 weeks");
  const [requestNote, setRequestNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSuccess(post._id, proposedDuration, requestNote);
      onClose();
    } catch (err) {
      console.error("Borrow request failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFF7E6] border-4 border-black rounded-[40px] w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black text-white rounded-full hover:bg-red-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-black text-black mb-1 uppercase italic tracking-tight">
            Request to Borrow from {post.user?.name.split(' ')[0]}'s Library
          </h2>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold text-xs">
              {post.user?.avatar ? <img src={post.user.avatar} className="w-full h-full object-cover" /> : post.user?.name?.charAt(0)}
            </div>
            <span className="font-bold text-sm">{post.user?.name}</span>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="w-24 h-36 border-2 border-black rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <img src={post.image || post.book?.thumbnail} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 py-1">
              <h3 className="text-xl font-black text-black leading-tight mb-1">{post.book?.title}</h3>
              <p className="text-xs font-bold text-black/50 mb-3 uppercase tracking-wider">{post.book?.authors?.join(", ")}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFD9A0]/30 border-2 border-black rounded-full">
                <span className="text-[10px] font-black uppercase tracking-tight italic">Condition: {post.condition} ✨</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="text-[11px] font-black uppercase mb-2 block tracking-wider flex items-center gap-2">
                  <Clock size={14} /> Proposed Duration
                </label>
                <select
                  value={proposedDuration}
                  onChange={(e) => setProposedDuration(e.target.value)}
                  className="w-full border-2 border-black rounded-2xl p-3 bg-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-200"
                >
                  <option>1 week</option>
                  <option>2 weeks (Standard)</option>
                  <option>1 month</option>
                  <option>Flexible</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-[11px] font-black uppercase mb-2 block tracking-wider flex items-center gap-2">
                  <BookOpen size={14} /> Note for {post.user?.name.split(' ')[0]}
                </label>
                <textarea
                  placeholder={`Hi ${post.user?.name.split(' ')[0]}! I'd love to read...`}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  className="w-full border-2 border-black rounded-2xl p-3 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-200 min-h-[100px] resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border-2 border-black rounded-2xl font-black uppercase italic tracking-widest text-[11px] hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[1.5] py-4 bg-orange-400 border-2 border-black rounded-2xl font-black uppercase italic tracking-widest text-[11px] animate-pulse shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:animate-none hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} />
                {submitting ? "Sending..." : "Send Request 🤝"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestBorrowModal;
