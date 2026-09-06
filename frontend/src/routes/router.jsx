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
import MechanicProfile from "../pages/mechanic/MechanicProfile";

import MechanicInspectionRequests from "../pages/mechanic/InspectionRequests";

import Appointments from "../pages/client/Appointments";

import Availability from "../pages/mechanic/Availability";

import MechanicAppointments from "../pages/mechanic/Appointments";

import CompleteInspection from "../pages/mechanic/CompleteInspection";

import InspectionReports from "../pages/client/InspectionReports";

import Reviews from "../pages/mechanic/Reviews";

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
    element: <ProtectedRoute allowedRoles={["client"]} />,

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
            element: <InspectionRequests />,
          },

          {
            path: "inspection-requests/create",
            element: <CreateInspectionRequest />,
          },

          {
            path: "appointments",
            element: <Appointments />,
          },

          {
            path: "inspection-reports",
            element: <InspectionReports />,
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
    element: <ProtectedRoute allowedRoles={["mechanic"]} />,

    children: [
      {
        path: "/mechanic",
        element: <MechanicDashboardLayout />,

        children: [
          {
            path: "dashboard",
            element: <MechanicDashboard />,
          },
          {
            path: "profile",
            element: <MechanicProfile />,
          },

          {
            path: "inspection-requests",
            element: <MechanicInspectionRequests />,
          },
          {
            path: "availability",
            element: <Availability />,
          },

          {
            path: "appointments",
            element: <MechanicAppointments />,
          },

          {
            path: "appointments/:appointmentId/complete",
            element: <CompleteInspection />,
          },

          {
            path: "reviews",
            element: <Reviews />,
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
    element: <ProtectedRoute allowedRoles={["admin"]} />,

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
