import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png"
import RouterConstant from '../../constants/routerConstant';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar = ({ isOpen, onClose, activeItem, setActiveItem }: SidebarProps) => {
  const navigate = useNavigate();

  // Dashboard Icon
  const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="2" y="10" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
    </svg>
  );

  const MailAnalyticsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 5L9 10L16 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <path d="M5 8L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 10L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const BulkEmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M10 2L4 10H9L8 16L14 8H9L10 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ScheduleEmailsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="4" width="12" height="11" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <path d="M3 7H15" stroke="white" strokeWidth="1.5"/>
      <path d="M6 2V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 2V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="10" r="0.75" fill="white"/>
      <circle cx="9" cy="10" r="0.75" fill="white"/>
      <circle cx="11" cy="10" r="0.75" fill="white"/>
    </svg>
  );

  const CustomEmailsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="5" y="4" width="10" height="12" rx="1.5" stroke="white" strokeWidth="1.5"/>
      <path d="M3 6V14C3 14.8284 3.67157 15.5 4.5 15.5H12" stroke="white" strokeWidth="1.5"/>
      <path d="M8 8H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 11H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const EmailSignaturesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11 3L15 7L7 15H3V11L11 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 4L14 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ProfileSettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3" stroke="white" strokeWidth="1.5"/>
      <path d="M9 1V3M9 15V17M17 9H15M3 9H1M14.5 3.5L13.1 4.9M4.9 13.1L3.5 14.5M14.5 14.5L13.1 13.1M4.9 4.9L3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, route:RouterConstant.Dashboard },
    { name: 'Mail Analytics', icon: <MailAnalyticsIcon />, route: RouterConstant.MailAnalytices},
    { name: 'Bulk Email', icon: <BulkEmailIcon />, route:RouterConstant.BULK_EMAIL },
    { name: 'Schedule Emails', icon: <ScheduleEmailsIcon />, route:RouterConstant.SCHEDULE_EMAILS },
    { name: 'Custom Emails', icon: <CustomEmailsIcon />, route: Router },
    { name: 'Email Signatures', icon: <EmailSignaturesIcon />, route: '/email-signatures' },
    { name: 'Profile Settings', icon: <ProfileSettingsIcon />, route: '/profile-settings' },
  ];

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    // Dispatch logout action to Redux
    // dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[258px] h-screen bg-[#1a1d3a] flex flex-col pt-6 pb-6 border-r border-[#2a2d4a]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-white hover:bg-[#252842] p-2 rounded"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo Section */}
        <div className="w-[208px] h-[46.76px] flex items-center pl-6 gap-2 mb-[38px]">
          {/* Replace this div with your actual logo image */}
          <img src={logo} alt='AIMILer'/>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col flex-grow">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                setActiveItem(item.name);
                navigate(item.route);
                onClose();
              }}
              className={`w-[258px] h-[46px] flex items-center pl-6 cursor-pointer transition-all duration-300 ${
                activeItem === item.name 
                  ? 'bg-[#2d3154] border-l-4 border-[#4f7cff]' 
                  : 'border-l-4 border-transparent hover:bg-[#252842]'
              }`}
            >
              <div className="w-[208px] h-[18px] flex items-center gap-3">
                <div className="w-[18px] h-[18px] flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-white text-base font-medium whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div
          className="w-[258px] h-[66px] flex items-center justify-center cursor-pointer hover:bg-[#252842] transition-all duration-300"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-2">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#ff4757"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-[#ff4757] text-lg font-medium">
              Logout
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;