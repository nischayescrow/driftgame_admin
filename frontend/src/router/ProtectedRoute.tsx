import React, { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { NavLink } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {}, [user]);

  if (!user) {
    return <NavLink to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
