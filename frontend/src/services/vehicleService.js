import api from "./api";

const vehicleService = {
  async getAll() {
    return api.get("/api/vehicles");
  },

  async getById(id) {
    return api.get(`/api/vehicles/${id}`);
  },

  async create(data) {
    return api.post("/api/vehicles", data);
  },

  async update(id, data) {
    return api.put(`/api/vehicles/${id}`, data);
  },

  async remove(id) {
    return api.delete(`/api/vehicles/${id}`);
  },
};

export default vehicleService;