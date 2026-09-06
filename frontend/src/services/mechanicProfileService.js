import api from "./api";

const mechanicProfileService = {
  async getProfile() {
    return api.get("/api/mechanic/profile");
  },

  async createProfile(data) {
    return api.post("/api/mechanic/profile", data);
  },

  async updateProfile(data) {
    return api.put("/api/mechanic/profile", data);
  },
};

export default mechanicProfileService;