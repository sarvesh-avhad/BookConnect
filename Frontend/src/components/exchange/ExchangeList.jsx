import ExchangeCard from "./ExchangeCard";

const ExchangeList = ({ activeTab }) => {
  const dummyData = [
    {
      title: "Atomic Habits",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      userText: "Requested by Rahul",
      type: "Incoming",
    },
    {
      title: "Ikigai",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      userText: "Requested from Meera",
      type: "Outgoing",
    },
    {
      title: "The Alchemist",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      userText: "Exchanged with Ananya",
      type: "Completed",
    },
  ];

  const filtered = dummyData.filter(
    (item) => item.type === activeTab
  );

  return (
    <div className="p-6 flex flex-col gap-4">
      {filtered.map((item, index) => (
        <ExchangeCard key={index} data={item} />
      ))}
    </div>
  );
};

export default ExchangeList;
