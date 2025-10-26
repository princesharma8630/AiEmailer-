// component/bulkEmail/CampaignTabs.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Clock, Mail } from 'lucide-react';
import { ROUTES } from '../../constants/routerConstant';

const tabs = [
  {
    id: 'bulk',
    name: 'Bulk Email',
    icon: Zap,
    path: ROUTES.BULK_EMAIL,
  },
  {
    id: 'schedule',
    name: 'Schedule Emails',
    icon: Clock,
    path: ROUTES.SCHEDULE_EMAILS,
  },
  {
    id: 'custom',
    name: 'Custom Emails',
    icon: Mail,
    path: ROUTES.CUSTOM_EMAILS,
  },
];

export default function CampaignTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon size={18} />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}