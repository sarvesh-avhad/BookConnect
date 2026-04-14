const ExchangeTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Incoming", "Outgoing", "Completed"];

  return (
    <div className="flex gap-3 p-4 border-b-2 border-black/70 bg-[#F5EAD7]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-semibold border-2 border-black rounded-full transition
            ${
              activeTab === tab
                ? "bg-[#FFD9A0]"
                : "bg-[#FFF7E6] hover:bg-[#FFD9A0]/60"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ExchangeTabs;
