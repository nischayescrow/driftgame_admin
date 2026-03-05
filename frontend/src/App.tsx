import { Toaster } from "react-hot-toast";
import "./styles/App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "./components/common/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { useEffect, useState } from "react";
import { verifyUser } from "./features/auth/services/auth.service";
import { AuthRoutes, ProtectedRoutes } from "./lib/constants/ProtectedRoutes";
import {
  startLoading,
  stopLoading,
} from "./components/common/loader/loader.slice";

function App() {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [routeChange, setRouteChange] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const verifyMe = async () => {
    if (!routeChange) dispatch(startLoading());
    // dispatch(startLoading());
    const verifyMeRes = await verifyUser();
    setTimeout(() => {
      console.log("init-verify me:");
      setRouteChange(false);
      dispatch(stopLoading());
    }, 300);

    console.log("verifyMeRes: ", verifyMeRes);

    if (!verifyMeRes && ProtectedRoutes.includes(location.pathname)) {
      console.log("Navigate to login page!!");
      navigate("/");
    }

    if (verifyMeRes && AuthRoutes.includes(location.pathname)) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    console.log("Current path: ", location.pathname);
    verifyMe();
  }, [location.pathname]);

  useEffect(() => {
    console.log("Current path: init-verify me:", location.pathname);
    verifyMe();
  }, []);
  return (
    <div className="min-w-screen max-w-screen overflow-hidden min-h-screen max-h-screen flex flex-col">
      {/* Loader */}
      {(isLoading || routeChange) && <Loader />}

      {/* {isLoading && <Loader />} */}
      {/* Toaster */}
      <Toaster position="top-center" />
      <Outlet />
    </div>
  );
}

export default App;
