import api from "./api";

const mechanicAvailabilityService = {
  async getAll() {
    return api.get("/api/mechanic/availability");
  },

  async create(data) {
    return api.post("/api/mechanic/availability", data);
  },

  async update(id, data) {
    return api.put(
      `/api/mechanic/availability/${id}`,
      data
    );
  },

  async remove(id) {
    return api.delete(
      `/api/mechanic/availability/${id}`
    );
  },
};

export default mechanicAvailabilityService;