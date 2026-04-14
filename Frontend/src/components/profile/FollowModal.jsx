import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FollowModal = ({ isOpen, onClose, title, users }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUserClick = (id) => {
        onClose();
        navigate(`/profile/${id}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#F5EAD7] border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-4 border-black bg-white">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">
                        {title} ({users?.length || 0})
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-orange-400 border-2 border-black rounded-xl hover:bg-orange-300 hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        <X size={18} className="text-black" />
                    </button>
                </div>

                {/* User List */}
                <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
                    {(!users || users.length === 0) ? (
                        <div className="text-center p-6 text-black/50 font-bold uppercase text-sm">
                            No {title.toLowerCase()} yet.
                        </div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => handleUserClick(u._id)}
                                className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-2xl cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl border-2 border-black overflow-hidden bg-[#FFD9A0] flex items-center justify-center text-lg font-bold flex-shrink-0">
                                    {u.avatar ? (
                                        <img
                                            src={u.avatar}
                                            alt={u.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        u.name?.charAt(0) || "U"
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-bold text-black truncate group-hover:text-orange-500 transition-colors">
                                        {u.name}
                                    </h3>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowModal;
