import api from "./api";

const adminAppointmentService = {
  async getAll() {
    return api.get("/api/admin/appointments");
  },

  async getById(id) {
    return api.get(`/api/admin/appointments/${id}`);
  },
};

export default adminAppointmentService;