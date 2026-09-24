import api from "./api";

const authService = {
  async csrf() {
    return api.get("/sanctum/csrf-cookie");
  },

  async login(email, password) {
    await this.csrf();

    return api.post("/login", {
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

    return api.post("/register", {
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
    return api.post("/logout");
  },
};

export default authService;