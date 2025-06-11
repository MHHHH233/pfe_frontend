const BASE_URL = '/api/admin/v1/';

const analyticsEndpoints = {
    getAnalytics: BASE_URL + 'analytics',
    getAnalyticsByDateRange: BASE_URL + 'analytics/date-range',
    // Fallback endpoints in case the primary ones don't work
    getAnalyticsAlt: BASE_URL + 'dashboard/analytics',
    getAnalyticsByDateRangeAlt: BASE_URL + 'dashboard/analytics/date-range'
};

export default analyticsEndpoints;