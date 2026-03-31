import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import App from "../App";
import AuthLayout from "../components/layouts/AuthLayout";
import Signup from "../pages/Signup";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import GameMode from "../pages/GameMode";
import PlayerLevel from "../pages/PlayerLevel";
import Car from "../pages/Car";
import ClientConfig from "../pages/ClientConfig";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        ),
      },
      {
        path: "/users",
        element: (
          <DashboardLayout>
            <Users />
          </DashboardLayout>
        ),
      },
      {
        path: "/gamemodes",
        element: (
          <DashboardLayout>
            <GameMode />
          </DashboardLayout>
        ),
      },
      {
        path: "/playerlevels",
        element: (
          <DashboardLayout>
            <PlayerLevel />
          </DashboardLayout>
        ),
      },
      {
        path: "/cars",
        element: (
          <DashboardLayout>
            <Car />
          </DashboardLayout>
        ),
      },
      {
        path: "/client-config",
        element: (
          <DashboardLayout>
            <ClientConfig />
          </DashboardLayout>
        ),
      },
    ],
  },
]);

export default AppRouter;
