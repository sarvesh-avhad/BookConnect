import Sidebar from "../components/navigation/Sidebar";
import RightPanel from "../components/navigation/RightPanel";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F5EAD7] p-6 overflow-hidden">
      <div className="h-[calc(100vh-48px)] w-full border-2 border-black shadow-md flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 border-l-2 border-r-2 border-black overflow-y-auto">
          {children}
        </main>

        <RightPanel />
      </div>
    </div>
  );
};

export default DashboardLayout;
