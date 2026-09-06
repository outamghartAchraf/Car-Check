import api from "./api";

const mechanicInspectionRequestService = {
  async getAll() {
    return api.get(
      "/api/mechanic/inspection-requests"
    );
  },

  async getById(id) {
    return api.get(
      `/api/mechanic/inspection-requests/${id}`
    );
  },

  async accept(id) {
    return api.patch(
      `/api/mechanic/inspection-requests/${id}/accept`
    );
  },

  async reject(id) {
    return api.patch(
      `/api/mechanic/inspection-requests/${id}/reject`
    );
  },
};

export default mechanicInspectionRequestService;