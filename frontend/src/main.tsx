import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./router/AppRouter.tsx";
import { Provider } from "react-redux";
import AppStore from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={AppStore}>
      <RouterProvider router={AppRouter} />
    </Provider>
  </StrictMode>,
);
