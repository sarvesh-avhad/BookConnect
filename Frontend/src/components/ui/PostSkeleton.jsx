const PostSkeleton = () => (
    <div className="w-full max-w-xl border-2 border-black bg-[#FFF7E6] rounded-2xl p-4 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E8D5B7]" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded-full bg-[#E8D5B7]" />
                <div className="h-2 w-16 rounded-full bg-[#E8D5B7]" />
            </div>
        </div>

        {/* Image + actions */}
        <div className="mt-4 flex gap-3">
            <div className="flex-1 h-48 rounded-2xl bg-[#E8D5B7]" />
            <div className="w-14 flex flex-col items-center justify-center gap-8">
                <div className="w-12 h-12 rounded-2xl bg-[#E8D5B7]" />
                <div className="w-12 h-12 rounded-2xl bg-[#E8D5B7]" />
                <div className="w-12 h-12 rounded-2xl bg-[#E8D5B7]" />
            </div>
        </div>

        {/* Caption */}
        <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-[#E8D5B7]" />
            <div className="h-3 w-3/4 rounded-full bg-[#E8D5B7]" />
        </div>
    </div>
);

export default PostSkeleton;
