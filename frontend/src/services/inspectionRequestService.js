import api from "./api";

const inspectionRequestService = {
  async getAll() {
    return api.get("/api/inspection-requests");
  },

  async getById(id) {
    return api.get(`/api/inspection-requests/${id}`);
  },

  async create(data) {
    return api.post("/api/inspection-requests", data);
  },

  async update(id, data) {
    return api.put(`/api/inspection-requests/${id}`, data);
  },

  async cancel(id) {
    return api.patch(
      `/api/inspection-requests/${id}/cancel`
    );
  },
};

export default inspectionRequestService;