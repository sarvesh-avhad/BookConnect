import { useEffect, useState, useContext } from "react";
import { getComments, addComment, deleteComment } from "../../services/commentService";
import { AuthContext } from "../../context/AuthContext";
import { Trash2 } from "lucide-react";

const CommentSection = ({ postId, onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    const data = await getComments(postId);
    setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment = await addComment(postId, text);
    setComments([newComment, ...comments]);
    setText("");
    if (onCommentAdded) onCommentAdded();
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="mt-4 border-t pt-3">
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border-2 border-black rounded-xl px-3 py-2 text-sm"
        />
        <button className="px-4 bg-orange-400 border-2 border-black rounded-xl font-bold">
          Send
        </button>
      </form>

      {/* Comments */}
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        {comments.map((c) => {
          const commentUserId = c.user?._id || c.user?.id || c.user;
          const currentUserId = user?.id || user?._id;
          const isCommentOwner = currentUserId && commentUserId && String(commentUserId) === String(currentUserId);
          
          return (
            <div
              key={c._id}
              className="bg-[#FFF7E6] border border-black/20 rounded-xl px-3 py-2 text-sm flex items-start justify-between gap-2"
            >
              <div>
                <span className="font-semibold">{c.user?.name || "User"}:</span>{" "}
                {c.text}
              </div>
              
              {isCommentOwner && (
                <button 
                  onClick={() => handleDelete(c._id)}
                  className="mt-0.5 text-black/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
