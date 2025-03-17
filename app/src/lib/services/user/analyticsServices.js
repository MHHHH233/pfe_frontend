import userapi from "../../userapi";
import analytics from "../../endpoint/user/analytics";
const analyticsService = {
    getAnalytics: async () => {
        const response = await userapi.get(analytics.getAnalytics);
        return response.data;
    }
}


export default analyticsService;