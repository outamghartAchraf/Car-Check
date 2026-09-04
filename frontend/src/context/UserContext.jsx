import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

export const UserStateContext = createContext({
  user: null,
  authenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export default function UserContext({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Get authenticated user
   */
  const getUser = async () => {
    try {
      const response = await authService.getUser();
      const authenticatedUser = response.data.user ?? response.data;

      setUser(authenticatedUser);
      setAuthenticated(true);

      return authenticatedUser;
    } catch (error) {
      setUser(null);
      setAuthenticated(false);

      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login
   */
  const login = async (email, password) => {
    await authService.login(email, password);

    const response = await authService.getUser();
    const authenticatedUser = response.data.user ?? response.data;

    setUser(authenticatedUser);
    setAuthenticated(true);

    return authenticatedUser;
  };

  /**
   * Register
   */
  const register = async (
    name,
    email,
    password,
    password_confirmation
  ) => {
    await authService.register(
      name,
      email,
      password,
      password_confirmation
    );

    return await getUser();
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAuthenticated(false);
    }
  };

  /**
   * Check authentication when app starts
   */
  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        user,
        setUser,
        authenticated,
        setAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export const useUserContext = () =>
  useContext(UserStateContext);