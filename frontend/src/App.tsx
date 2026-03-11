import { Toaster } from "react-hot-toast";
import "./styles/App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "./components/common/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { useEffect, useState } from "react";
import { logout, verifyUser } from "./features/auth/services/auth.service";
import { AuthRoutes, ProtectedRoutes } from "./lib/constants/ProtectedRoutes";
import {
  startLoading,
  stopLoading,
} from "./components/common/loader/loader.slice";
import { removeUser } from "./features/user/user.slice";

function App() {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [isPageLoading, setPageLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const verifyMe = async () => {
    dispatch(startLoading());
    const verifyMeRes = await verifyUser();
    dispatch(stopLoading());
    console.log("verifyMeRes: ", verifyMeRes);

    if (!verifyMeRes && ProtectedRoutes.includes(location.pathname)) {
      console.log("Navigate to login page!!");

      dispatch(startLoading());
      await logout();
      setTimeout(() => dispatch(stopLoading()), 500);
      // console.log("logoutRes: ", logoutRes);

      dispatch(removeUser());
      navigate("/", { replace: true });
    }

    if (verifyMeRes && AuthRoutes.includes(location.pathname)) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    // console.log("Current path: ", location.pathname);
    (async () => await verifyMe())();
  }, []);

  useEffect(() => {
    setPageLoading(true);

    const delay = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(delay);
  }, []);
  return (
    <div className="max-w-screen overflow-hidden min-h-screen max-h-screen flex flex-col">
      {/* Loader */}
      {(isLoading || isPageLoading) && <Loader />}

      {/* Toaster */}
      <Toaster position="top-center" />
      <Outlet />
    </div>
  );
}

export default App;
