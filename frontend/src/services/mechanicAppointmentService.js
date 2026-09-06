import api from "./api";

const mechanicAppointmentService = {
  async getAll() {
    return api.get("/api/mechanic/appointments");
  },

  async getById(id) {
    return api.get(`/api/appointments/${id}`);
  },

  async cancel(id) {
    return api.patch(`/api/appointments/${id}/cancel`);
  },
};

export default mechanicAppointmentService;