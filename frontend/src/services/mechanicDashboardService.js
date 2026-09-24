import api from "./api";

const mechanicDashboardService = {
  async getDashboard() {
    return api.get("/api/mechanic/dashboard");
  },
};

export default mechanicDashboardService;