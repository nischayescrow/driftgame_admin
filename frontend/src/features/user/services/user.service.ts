import toast from "react-hot-toast";
import api from "../../../lib/api";
import type { SignUpSchemaType } from "../../auth/schemas/auth.schema";

export const fetchAllUser = async (limit: number, page: number) => {
  try {
    const fetchAllUserRes = await api.get(
      `/admin/user/get/all?limit=${limit}&page=${page}`,
    );

    return fetchAllUserRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const searchUsers = async (
  text: string,
  limit: number,
  page: number,
) => {
  try {
    const searchUserRes = await api.get(
      `/admin/user/search?text=${text}&limit=${limit}&page=${page}&all=true`,
    );

    return searchUserRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const addUser = async (data: SignUpSchemaType) => {
  try {
    const addRes = await api.post(`/admin/user/create`, data);

    return addRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};
