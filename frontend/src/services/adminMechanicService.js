import api from "./api";

const adminMechanicService = {
  async getAll() {
    return api.get("/api/admin/mechanics");
  },

  async getById(id) {
    return api.get(`/api/admin/mechanics/${id}`);
  },

  async certify(id) {
    return api.patch(
      `/api/admin/mechanics/${id}/certify`
    );
  },

  async reject(id) {
    return api.patch(
      `/api/admin/mechanics/${id}/reject`
    );
  },
};

export default adminMechanicService;