import api from "./api";

const adminInspectionRequestService = {
  async getAll() {
    return api.get("/api/admin/inspection-requests");
  },

  async getById(id) {
    return api.get(
      `/api/admin/inspection-requests/${id}`
    );
  },
};

export default adminInspectionRequestService;