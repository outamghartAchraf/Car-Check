import api from "./api";

const inspectionReportService = {
  async getAll() {
    return api.get("/api/inspection-reports");
  },

  async getById(id) {
    return api.get(`/api/inspection-reports/${id}`);
  },

  async downloadPdf(id) {
    return api.get(`/api/inspection-reports/${id}/pdf`, {
      responseType: "blob",
    });
  },
};

export default inspectionReportService;
