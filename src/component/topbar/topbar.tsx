import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const navigate = useNavigate();
  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth.user);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem('token');
    // Dispatch logout action
    // dispatch(logout());
    navigate('/login');
  };

  // Fallback user data if not in Redux
  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';
 

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-[62px] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 hover:text-gray-900 p-2 -ml-2"
      >
        <Menu size={24} />
      </button>

      {/* Left Side - Greeting */}
      <div className="flex items-center">
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
          Hello, {userName.split(' ')[0]}!
        </h1>
      </div>

      {/* Right Side - User Profile */}
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 lg:gap-3 hover:bg-gray-50 rounded-lg px-2 lg:px-3 py-2 transition-colors duration-200"
        >
         

          {/* User Name - Hidden on small screens */}
          <span className="hidden sm:block text-gray-700 font-medium text-sm">
            {userName}
          </span>

          {/* Dropdown Icon */}
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isProfileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 mt-1">{userEmail}</p>
            </div>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                navigate('/profile-settings');
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                navigate('/profile-settings');
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
