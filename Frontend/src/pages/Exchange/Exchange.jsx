import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ExchangeCard from "../../components/exchange/ExchangeCard";
import BrowseBookCard from "../../components/exchange/BrowseBookCard";
import RequestBorrowModal from "../../components/exchange/RequestBorrowModal";
import {
  getIncoming,
  getOutgoing,
  getAvailable,
  getMyLendings,
  requestExchange,
} from "../../services/exchangeService";
import { Inbox, Send, Search } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Exchange = () => {
  const [tab, setTab] = useState("incoming"); // "incoming" (marketplace) or "outgoing" (my lendings)
  const [exchanges, setExchanges] = useState([]); // For my lendings / requests
  const [availableBooks, setAvailableBooks] = useState([]); // For the discovery tab
  const [counts, setCounts] = useState({ incoming: 0, outgoing: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const { showToast } = useToast();
  const { user: currentUser } = useContext(AuthContext);

  const loadData = async () => {
    try {
      setLoading(true);
      const [avail, myLends] = await Promise.all([
        getAvailable(),
        getMyLendings(),
      ]);

      setCounts({
        incoming: avail.length,
        outgoing: myLends.length,
      });

      setAvailableBooks(avail);
      
      if (tab === "incoming") {
        setExchanges(avail);
      } else {
        setExchanges(myLends);
      }
    } catch (err) {
      console.error("Failed to load exchange data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab]);

  const handleCreateRequest = async (postId, duration, note) => {
    try {
      await requestExchange(postId, duration, note);
      showToast("Borrow request sent! 🤝");
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send request", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-8 border-b-2 border-black/10 bg-[#F5EAD7]/30">
          <h1 className="text-3xl font-black text-black uppercase italic tracking-tighter">
            Exchange Requests
          </h1>
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest mt-1">
            Manage your book swaps & discovery
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-8">
          <div className="inline-flex gap-2 bg-white border-4 border-black rounded-[24px] p-1.5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setTab("incoming")}
              className={`flex items-center gap-3 px-8 py-3 text-xs font-black uppercase italic tracking-widest rounded-[18px] transition-all
                ${tab === "incoming"
                    ? "bg-orange-500 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    : "text-black/40 hover:bg-black/5"
                }`}
            >
              <Inbox size={16} />
              Incoming
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white text-black border-2 border-black">
                {counts.incoming}
              </span>
            </button>

            <button
              onClick={() => setTab("outgoing")}
              className={`flex items-center gap-3 px-8 py-3 text-xs font-black uppercase italic tracking-widest rounded-[18px] transition-all
                ${tab === "outgoing"
                    ? "bg-orange-500 text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    : "text-black/40 hover:bg-black/5"
                }`}
            >
              <Send size={16} />
              Outgoing
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white text-black border-2 border-black">
                {counts.outgoing}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {tab === "incoming" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {availableBooks.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <Search size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-xl font-black opacity-20 uppercase italic">No books found in the marketplace</p>
                </div>
              ) : (
                availableBooks.map((book) => (
                  <BrowseBookCard 
                    key={book._id} 
                    post={book} 
                    onRequest={setSelectedBook}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-4xl">
              {exchanges.length === 0 ? (
                <div className="py-20 text-center">
                  <Inbox size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-xl font-black opacity-20 uppercase italic">No active requests or lendings</p>
                </div>
              ) : (
                exchanges.map((ex) => (
                  <ExchangeCard
                    key={ex._id}
                    exchange={ex}
                    onUpdate={loadData}
                    tab={ex.owner?._id === currentUser?._id ? "incoming" : "outgoing"}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <RequestBorrowModal
          post={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSuccess={handleCreateRequest}
        />
      )}
    </DashboardLayout>
  );
};

export default Exchange;
