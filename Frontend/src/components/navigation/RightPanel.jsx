import CreatePost from "../social/CreatePost";
import ExchangeWidget from "./ExchangeWidget";

const RightPanel = ({ onPostCreated }) => {
  return (
    <aside className="w-[420px] bg-[#F5EAD7] border-l-2 border-black/70">
      <div className="p-5 space-y-5 h-full overflow-y-auto">
        <CreatePost onPostCreated={onPostCreated} />
        <ExchangeWidget />
      </div>
    </aside>
  );
};

export default RightPanel;
