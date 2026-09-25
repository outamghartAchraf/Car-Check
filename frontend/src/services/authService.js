import api from "./api";

const authService = {
  async csrf() {
    return api.get("/sanctum/csrf-cookie");
  },

  async login(email, password) {
    await this.csrf();

    return api.post("/api/login", {   
      email,
      password,
    });
  },

  async register(
    name,
    email,
    password,
    password_confirmation,
    role
  ) {
    await this.csrf();

    return api.post("/api/register", {   
      name,
      email,
      password,
      password_confirmation,
      role,
    });
  },

  async getUser() {
    return api.get("/api/user");
  },

  async logout() {
    return api.post("/api/logout");   
  },
};

export default authService;