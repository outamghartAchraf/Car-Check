import { Navigate, Outlet } from "react-router-dom";

import { useUserContext } from "../context/UserContext";
import Loading from "../components/common/Loading";

export default function GuestLayout() {
  const {
    authenticated,
    loading,
    user,
  } = useUserContext();

  if (loading) {
    return <Loading />;
  }

  if (authenticated && user) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (user.role === "mechanic") {
      return (
        <Navigate
          to="/mechanic/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}