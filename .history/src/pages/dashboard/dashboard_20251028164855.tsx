import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Mail, MousePointerClick, Users, Clock } from 'lucide-react';
import StatsCard from '../../component/dashbord/StatsCard';
import StatusOverview from '../../component/dashbord/StatusOverview';
import ActivityChart from '../../component/dashbord/ActivityChart';
import RecentActivity from '../../component/dashbord/RecentActivity';
import FilterSection from '../../component/dashbord/FilterSection';
import {
  fetchDashboardStats,
  fetchStatusOverview,
  fetchActivityOverTime,
  fetchRecentActivity,
  setFilters,
} from '../../redux/slices/dashboardslices/dashboardSlice';
import type { RootState, AppDispatch } from '../../redux/store';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for filters
  const [searchValue, setSearchValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Get data from Redux store
  const {
    stats,
    statusOverview,
    activityData,
    recentActivity
  } = useSelector((state: RootState) => state.dashboard);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchStatusOverview());
    dispatch(fetchActivityOverTime());
    dispatch(fetchRecentActivity(10));
  }, [dispatch]);

  // Handle filter changes
  useEffect(() => {
    if (fromDate || toDate) {
      dispatch(setFilters({ fromDate, toDate }));
      dispatch(fetchActivityOverTime({ fromDate, toDate }));
    }
  }, [fromDate, toDate, dispatch]);

  const handleSendEmail = () => {
    console.log('Send new email clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container with Figma Layout Specs - Responsive */}
      <div 
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: '1120px',
        }}
      >
        <div 
          className="pt-8 sm:pt-16 lg:pt-24"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '39px',
            paddingTop: window.innerWidth >= 1024 ? '100px' : undefined,
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage and track your email campaigns.</p>
            </div>
            <button
              onClick={()=>{}}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Send New Email</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard
              icon={<Mail size={20} className="text-blue-600 sm:w-6 sm:h-6" />}
              value={stats?.totalOpens || 0}
              label="Total Opens"
              iconBgColor="bg-blue-100"
            />
            <StatsCard
              icon={<MousePointerClick size={20} className="text-green-600 sm:w-6 sm:h-6" />}
              value={stats?.totalClicks || 0}
              label="Total Clicks"
              iconBgColor="bg-green-100"
            />
            <StatsCard
              icon={<Users size={20} className="text-orange-600 sm:w-6 sm:h-6" />}
              value={stats?.uniqueRecipients || 0}
              label="Unique Recipients"
              iconBgColor="bg-orange-100"
            />
            <StatsCard
              icon={<Clock size={20} className="text-purple-600 sm:w-6 sm:h-6" />}
              value={stats?.recentActivity || 'N/A'}
              label="Recent Activity"
              iconBgColor="bg-purple-100"
            />
          </div>

          {/* Campaign Summary Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Campaign Summary</h2>
            
            {/* Filter Section */}
            <div className="mb-6 overflow-x-auto">
              <FilterSection
                searchValue={searchValue}
                fromDate={fromDate}
                toDate={toDate}
                onSearchChange={setSearchValue}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Status Overview */}
              {statusOverview && (
                <div className="">
                  <StatusOverview
                    data={{
                      opened: statusOverview.opened,
                      clicked: statusOverview.clicked,
                      notOpened: statusOverview.notOpened,
                      total: statusOverview.total,
                    }}
                  />
                </div>
              )}

              {/* Activity Chart */}
              <div className="">
                <ActivityChart data={activityData} />
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="">
            <RecentActivity activities={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;