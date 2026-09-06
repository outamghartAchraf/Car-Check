import api from "./api";

const appointmentService = {
  async getAll() {
    return api.get("/api/appointments");
  },

  async getById(id) {
    return api.get(`/api/appointments/${id}`);
  },

  async create(data) {
    return api.post("/api/appointments", data);
  },

  async cancel(id) {
    return api.patch(`/api/appointments/${id}/cancel`);
  },

  async getAvailableSlots(inspectionRequestId, date) {
    return api.get(
      `/api/inspection-requests/${inspectionRequestId}/available-slots`,
      {
        params: {
          date,
        },
      }
    );
  },
};

export default appointmentService;