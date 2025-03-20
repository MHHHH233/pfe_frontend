import userapi from "../../userapi";
import stagesEndpoints from "../../endpoint/admin/stages";

const stagesService = {
    getAllStages: async (page = 1, perPage = 10) => {
        try {
            const response = await userapi.get(stagesEndpoints.getAllStages(page, perPage));
            return response.data;
        } catch (error) {
            console.error('Get stages error:', error.response?.data || error.message);
            throw error;
        }
    },

    getStage: async (id) => {
        try {
            const response = await userapi.get(stagesEndpoints.getStage(id));
            return response.data;
        } catch (error) {
            console.error('Get stage error:', error.response?.data || error.message);
            throw error;
        }
    },

    createStage: async (stageData) => {
        try {
            const response = await userapi.post(stagesEndpoints.createStage, stageData);
            return response.data;
        } catch (error) {
            console.error('Create stage error:', error.response?.data || error.message);
            throw error;
        }
    },

    updateStage: async (id, stageData) => {
        try {
            const response = await userapi.put(stagesEndpoints.updateStage(id), stageData);
            return response.data;
        } catch (error) {
            console.error('Update stage error:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteStage: async (id) => {
        try {
            const response = await userapi.delete(stagesEndpoints.deleteStage(id));
            return response.data;
        } catch (error) {
            console.error('Delete stage error:', error.response?.data || error.message);
            throw error;
        }
    },

    searchStages: async (query) => {
        try {
            const response = await userapi.get(stagesEndpoints.searchStages(query));
            return response.data;
        } catch (error) {
            console.error('Search stages error:', error.response?.data || error.message);
            throw error;
        }
    }
};

export default stagesService; 