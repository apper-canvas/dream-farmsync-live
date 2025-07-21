import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <main className="flex-1">
          <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;