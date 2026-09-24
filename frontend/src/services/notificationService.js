import api from "./api";

const notificationService = {
  async getAll() {
    return api.get("/api/notifications");
  },

  async markAsRead(id) {
    return api.patch(`/api/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.patch("/api/notifications/read-all");
  },

  async remove(id) {
    return api.delete(`/api/notifications/${id}`);
  },
};

export default notificationService;