import api from "./api";

const clientDashboardService = {
  async getDashboard() {
    return api.get("/api/client/dashboard");
  },
};

export default clientDashboardService;