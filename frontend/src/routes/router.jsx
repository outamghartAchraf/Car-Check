import { createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "../layouts/layouts";
import GuestLayout from "../layouts/GuestLayout";

import ClientDashboardLayout from "../layouts/client/ClientDashboardLayout";
import MechanicDashboardLayout from "../layouts/mechanic/MechanicDashboardLayout";
import AdminDashboardLayout from "../layouts/admin/AdminDashboardLayout";

// Protection
import ProtectedRoute from "../components/layout/ProtectedRoute";

// Public pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

// Dashboard pages
import ClientDashboard from "../pages/client/ClientDashboard";
import MechanicDashboard from "../pages/mechanic/MechanicDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import Vehicles from "../pages/client/Vehicles";

import InspectionRequests from "../pages/client/InspectionRequests";

import CreateInspectionRequest from "../pages/client/CreateInspectionRequest";

export const router = createBrowserRouter([
  /*
  |--------------------------------------------------------------------------
  | Public
  |--------------------------------------------------------------------------
  */

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Guest
  |--------------------------------------------------------------------------
  */

  {
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Unauthorized
  |--------------------------------------------------------------------------
  */

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  /*
  |--------------------------------------------------------------------------
  | Client
  |--------------------------------------------------------------------------
  */

  {
    element: (
      <ProtectedRoute allowedRoles={["client"]} />
    ),

    children: [
      {
        path: "/dashboard",
        element: <ClientDashboardLayout />,

        children: [
          {
            index: true,
            element: <ClientDashboard />,
          },

          {
          path: "vehicles",
          element: <Vehicles />,
        },

        {
          path: "inspection-requests",
          element: (
            <InspectionRequests />
          ),
        },

        {
          path: "inspection-requests/create",
          element: (
            <CreateInspectionRequest />
          ),
        },
        ],
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Mechanic
  |--------------------------------------------------------------------------
  */

  {
    element: (
      <ProtectedRoute allowedRoles={["mechanic"]} />
    ),

    children: [
      {
        path: "/mechanic",
        element: <MechanicDashboardLayout />,

        children: [
          {
            path: "dashboard",
            element: <MechanicDashboard />,
          },
        ],
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Admin
  |--------------------------------------------------------------------------
  */

  {
    element: (
      <ProtectedRoute allowedRoles={["admin"]} />
    ),

    children: [
      {
        path: "/admin",
        element: <AdminDashboardLayout />,

        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
]);