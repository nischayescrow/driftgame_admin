import { Toaster } from "react-hot-toast";
import "./styles/App.css";
import { Outlet } from "react-router-dom";
import Loader from "./components/common/loader/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

function App() {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  return (
    <div className="min-w-screen max-w-screen overflow-hidden min-h-screen max-h-screen flex flex-col">
      {/* Loader */}
      {isLoading && <Loader />}
      {/* Toaster */}
      <Toaster position="top-center" />
      <Outlet />
    </div>
  );
}

export default App;
