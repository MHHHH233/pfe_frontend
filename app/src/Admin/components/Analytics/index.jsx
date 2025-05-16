import React from 'react';
import AnalyticsOverview from './AnalyticsOverview';
import NotificationsAnalytics from './NotificationsAnalytics';

const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#07f468]">Analytics</h2>
      
      {/* Main Analytics Overview */}
      <AnalyticsOverview />
      
      {/* Notifications Analytics */}
      <NotificationsAnalytics />
    </div>
  );
};

export default AnalyticsPage; 