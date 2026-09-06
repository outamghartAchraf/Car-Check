import api from "./api";

const mechanicInspectionReportService = {
  async create(appointmentId, data) {
    return api.post(
      `/api/mechanic/appointments/${appointmentId}/complete`,
      data
    );
  },

  async getAll() {
    return api.get("/api/mechanic/inspection-reports");
  },

  async getById(id) {
    return api.get(`/api/inspection-reports/${id}`);
  },
};

export default mechanicInspectionReportService;