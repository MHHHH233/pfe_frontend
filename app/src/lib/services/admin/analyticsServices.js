import apiClient from "../../userapi";
import analyticsEndpoints from "../../endpoint/admin/analytics";

const analyticsService = {
    async getAnalytics() {
        try {
            console.log('Attempting to fetch analytics from primary endpoint');
            const response = await apiClient.get(analyticsEndpoints.getAnalytics);
            return response.data;
        } catch (primaryError) {
            console.error("Error fetching analytics from primary endpoint:", primaryError);
            
            // Try fallback endpoint
            try {
                console.log('Attempting to fetch analytics from fallback endpoint');
                const fallbackResponse = await apiClient.get(analyticsEndpoints.getAnalyticsAlt);
                return fallbackResponse.data;
            } catch (fallbackError) {
                console.error("Error fetching analytics from fallback endpoint:", fallbackError);
                
                // For demo purposes, return mock data if both endpoints fail
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Returning mock analytics data for development');
                    return getMockAnalyticsData();
                }
                
                throw fallbackError;
            }
        }
    },
    
    // Function to get analytics by date range
    async getAnalyticsByDateRange(startDate, endDate) {
        try {
            console.log('Attempting to fetch analytics by date range from primary endpoint');
            const response = await apiClient.get(analyticsEndpoints.getAnalyticsByDateRange, {
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });
            return response.data;
        } catch (primaryError) {
            console.error("Error fetching analytics by date range from primary endpoint:", primaryError);
            
            // Try fallback endpoint
            try {
                console.log('Attempting to fetch analytics by date range from fallback endpoint');
                const fallbackResponse = await apiClient.get(analyticsEndpoints.getAnalyticsByDateRangeAlt, {
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    }
                });
                return fallbackResponse.data;
            } catch (fallbackError) {
                console.error("Error fetching analytics by date range from fallback endpoint:", fallbackError);
                
                // For demo purposes, return mock data if both endpoints fail
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Returning mock analytics data for development');
                    return getMockAnalyticsData();
                }
                
                throw fallbackError;
            }
        }
    }
};

// Mock data function for development purposes
function getMockAnalyticsData() {
    return {
        "start_date": "2025-05-12",
        "end_date": "2025-06-27",
        "total_reservations": 4,
        "total_comptes": 3,
        "total_tournois": 1,
        "total_terrains": 2,
        "total_reported_bugs": 4,
        "total_ratings": 0,
        "total_player_requests": 2,
        "total_matches": 0,
        "total_players": 2,
        "total_stages": 3,
        "total_teams": 1,
        "total_academie_activites": 4,
        "total_academie_coaches": 2,
        "total_academie_programmes": 2,
        "total_activites_members": 2,
        "total_revenue": "100.00",
        "daily_revenue": [
            {
                "date": "2025-06-11",
                "daily_revenue": "100.00"
            }
        ]
    };
}

export default analyticsService;