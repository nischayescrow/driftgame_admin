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

export const verifyUser = () => {};
