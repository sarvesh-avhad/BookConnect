import {
  acceptExchange,
  rejectExchange,
  confirmExchange,
} from "../../services/exchangeService";
import { deletePost } from "../../services/postService";
import { CheckCircle2, XCircle, Mail, MessageSquare, Clock, Calendar, Trash2 } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGamification } from "../../context/GamificationContext";

const getStatusBadge = (status) => {
  if (status === "none") return <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black uppercase rounded-lg border border-gray-200">Listed (No Requests)</span>;
  if (status === "pending") return <span className="px-3 py-1 bg-[#FFD9A0]/40 text-[#E67E22] text-[10px] font-black uppercase rounded-lg border border-[#E67E22]/20">Requested</span>;
  if (status === "accepted") return <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-lg border border-green-200">Active</span>;
  if (status === "completed") return <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-200">Returned</span>;
  if (status === "rejected") return <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg border border-red-200">Rejected</span>;
  return null;
};

const ExchangeCard = ({ exchange, tab, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const { showPointsAwarded } = useGamification();
  const navigate = useNavigate();

  const handleAction = async (actionFn) => {
    try {
      setLoading(true);
      const updatedExchange = await actionFn(exchange._id);
      if (actionFn.name === 'confirmExchange' && updatedExchange.status === 'completed') {
        showPointsAwarded(10);
      }
      onUpdate();
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!window.confirm("Are you sure you want to remove this book listing?")) return;
    try {
      setLoading(true);
      const postId = exchange.post?._id || exchange.post;
      await deletePost(postId);
      showToast("Listing removed successfully");
      onUpdate();
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to remove listing", "error");
    } finally {
      setLoading(false);
    }
  };

  const isAccepted = exchange.status === "accepted";
  const userConfirmed = tab === "incoming" ? exchange.ownerConfirmed : exchange.requesterConfirmed;
  
  // Logic for partner display
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwner = 
    exchange.owner?._id === currentUserId || 
    exchange.owner === currentUserId || 
    exchange.post?.user?._id === currentUserId || 
    exchange.post?.user === currentUserId;

  const partner = isOwner ? exchange.requester : exchange.owner;

  return (
    <div className={`bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all ${exchange.status === 'none' ? 'opacity-80' : ''}`}>
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Book Jacket */}
        <div className="w-24 h-36 bg-[#F3DFC8] border-2 border-black rounded-2xl overflow-hidden flex-shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <img 
            src={exchange.post?.image || exchange.post?.book?.thumbnail} 
            alt="book" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col pt-1">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="font-black text-xl text-black truncate leading-tight">
              {exchange.post?.book?.title || "Untitled Book"}
            </h3>
            {getStatusBadge(exchange.status)}
          </div>
          
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">
            By {exchange.post?.book?.authors?.join(", ") || exchange.post?.book?.author}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 bg-black/5 rounded-lg text-[9px] font-black uppercase mb-4 self-start">
            {exchange.post?.category || "Fiction"}
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <div className="w-6 h-6 rounded-full border border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center font-bold text-[8px]">
              {isOwner 
                ? (partner?.avatar ? <img src={partner.avatar} className="w-full h-full object-cover" /> : <div className="text-black/20">?</div>)
                : (partner?.avatar ? <img src={partner.avatar} className="w-full h-full object-cover" /> : partner?.name?.charAt(0))
              }
            </div>
            <span className="text-[11px] font-bold text-black/70 italic">
              {exchange.status === 'none' 
                ? "Lending by You (Awaiting requests)" 
                : isOwner ? `Borrow request from ${partner?.name || 'Someone'}` : `Lent by ${partner?.name}`}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {(exchange.proposedDuration || exchange.requestNote) && (
        <div className="px-6 pb-4 border-t-2 border-dashed border-black/10 mt-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
          >
            {showDetails ? "Hide Borrow Details" : "View Borrow Details"}
          </button>

          {showDetails && (
            <div className="pb-4 pt-2 space-y-4 animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFD9A0]/20 p-3 rounded-2xl border border-black/5">
                  <span className="text-[9px] font-black uppercase opacity-40 block mb-1">Duration</span>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Clock size={14} className="text-orange-500" />
                    {exchange.proposedDuration || "2 weeks"}
                  </div>
                </div>
                <div className="bg-[#FFD9A0]/20 p-3 rounded-2xl border border-black/5">
                  <span className="text-[9px] font-black uppercase opacity-40 block mb-1">Book Condition</span>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={14} className="text-green-500" />
                    {exchange.post?.condition || "Good"}
                  </div>
                </div>
              </div>

              {exchange.requestNote && (
                <div className="bg-black/5 p-4 rounded-2xl border border-black/5">
                  <span className="text-[9px] font-black uppercase opacity-40 block mb-2">Note from Borrower</span>
                  <p className="text-xs italic leading-relaxed text-black/70">"{exchange.requestNote}"</p>
                </div>
              )}

              {isAccepted && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <Mail size={16} className="text-blue-500" />
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[9px] font-black uppercase text-blue-400 block mb-0.5">Contact Detail</span>
                    <p className="text-xs font-bold text-blue-900 truncate">{partner?.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex border-t-2 border-black">
        {exchange.status === "pending" && tab === "incoming" ? (
          <>
            <button
              onClick={() => handleAction(acceptExchange)}
              className="flex-1 py-4 bg-green-400 font-black uppercase italic tracking-widest text-[11px] hover:bg-green-500 transition-colors border-r-2 border-black"
            >
              Accept Request
            </button>
            <button
              onClick={() => handleAction(rejectExchange)}
              className="flex-1 py-4 bg-red-400 font-black uppercase italic tracking-widest text-[11px] hover:bg-red-500 transition-colors"
            >
              Reject
            </button>
          </>
        ) : isAccepted && !userConfirmed ? (
          <button
            onClick={() => handleAction(confirmExchange)}
            className="w-full py-4 bg-orange-400 font-black uppercase italic tracking-widest text-[11px] hover:bg-orange-500 transition-colors"
          >
            Mark as Returned / Completed
          </button>
        ) : (
          <>
            {partner && (
              <button
                onClick={() => navigate(`/chat/${partner?._id}`)}
                className={`flex-1 py-4 bg-[#F5EAD7] font-black uppercase italic tracking-widest text-[11px] hover:bg-[#FFD9A0] transition-colors flex items-center justify-center gap-2 ${isOwner ? 'border-r-2 border-black' : ''}`}
              >
                <MessageSquare size={16} /> Message {partner?.name?.split(' ')[0]}
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleDeleteListing}
                disabled={loading}
                className={`${partner ? 'flex-shrink-0 px-8' : 'flex-1'} py-4 bg-red-100 text-red-600 font-black uppercase italic tracking-widest text-[11px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2`}
              >
                <Trash2 size={16} /> Delete Listing
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExchangeCard;
