import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../component/sidebar/sidebar';
import Topbar from '../../component/topbar/topbar';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Component - Only needs onMenuClick prop */}
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Main Content - This is where your pages will render */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden max-w-[1120px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;