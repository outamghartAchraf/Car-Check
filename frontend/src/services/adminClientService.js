import api from "./api";

const adminClientService = {
  async getAll() {
    return api.get("/api/admin/clients");
  },

  async getById(id) {
    return api.get(`/api/admin/clients/${id}`);
  },
};

export default adminClientService;