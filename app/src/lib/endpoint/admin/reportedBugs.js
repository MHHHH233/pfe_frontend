const BASE_URL = '/api/admin/v1/reported-bugs';

const reportedBugsEndpoints = {
  getAllReportedBugs: BASE_URL,
  getReportedBug: (id) => `${BASE_URL}/${id}`,
  createReportedBug: BASE_URL,
  updateReportedBug: (id) => `${BASE_URL}/${id}`,
  updateStatus: (id) => `${BASE_URL}/${id}/status`,
  deleteReportedBug: (id) => `${BASE_URL}/${id}`,
};

export default reportedBugsEndpoints; 