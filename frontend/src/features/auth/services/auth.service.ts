import toast from "react-hot-toast";
import api from "../../../lib/api";
import type { LoginSchemaType, SignUpSchemaType } from "../schemas/auth.schema";

export const login = async (data: LoginSchemaType) => {
  try {
    const loginRes = await api.post("/admin/auth/login/email", data);

    return loginRes;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response ? error.response.data.message : error.message);
  }
};

export const singUp = async (data: SignUpSchemaType) => {
  try {
    const signupRes = await api.post("/admin/auth/signup/email", data);

    return signupRes;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response ? error.response.data.message : error.message);
  }
};

export const verifyUser = async () => {
  try {
    const verifyMeRes = await api.get("/admin/auth/verify/me");

    console.log("verifyUser: ", verifyMeRes);

    if (verifyMeRes.status !== 200) return false;

    return true;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
      throw error;
    }

    return false;
  }
};

export const refreshToken = async () => {
  try {
    const refreshTokenRes = await api.get("/admin/auth/refresh");

    if (refreshTokenRes.status !== 200) return false;

    return refreshTokenRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    } else {
      return false;
    }
  }
};

export const logout = async () => {
  try {
    const logoutRes = await api.get("/admin/auth/logout");

    return logoutRes;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response ? error.response.data.message : error.message);
    return false;
  }
};
