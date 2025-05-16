const BASE_URL = '/api/user/v1/reported-bugs';

const reportedBugsEndpoints = {
  createBugReport: BASE_URL,
  deleteBugReport: (id) => `${BASE_URL}/${id}`,
};

export default reportedBugsEndpoints; 