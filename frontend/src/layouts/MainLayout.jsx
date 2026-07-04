import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="flex">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 bg-slate-100 min-h-screen p-4 md:p-8 pb-24">
          {children}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </>
  );
}

export default MainLayout;