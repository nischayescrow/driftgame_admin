import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import App from "../App";
import AuthLayout from "../components/layouts/AuthLayout";
import Signup from "../pages/Signup";

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
    ],
  },
]);

export default AppRouter;
