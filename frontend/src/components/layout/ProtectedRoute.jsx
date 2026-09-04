import { Navigate, Outlet } from "react-router-dom";

import { useUserContext } from "../../context/UserContext";
import Loading from "../common/Loading";

export default function ProtectedRoute({
  allowedRoles,
}) {
  const {
    user,
    authenticated,
    loading,
  } = useUserContext();

  if (loading) {
    return <Loading />;
  }

  if (!authenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}