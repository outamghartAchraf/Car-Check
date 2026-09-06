import api from "./api";

const reviewService = {
  async create(inspectionReportId, data) {
    return api.post(
      `/api/inspection-reports/${inspectionReportId}/review`,
      data
    );
  },

  async getMechanicReviews() {
    return api.get("/api/mechanic/reviews");
  },
};

export default reviewService;