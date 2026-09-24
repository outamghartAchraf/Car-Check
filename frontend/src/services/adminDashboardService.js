import api from "./api";

const adminDashboardService = {
  async getDashboard() {
    return api.get("/api/admin/dashboard");
  },
};

export default adminDashboardService;