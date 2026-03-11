import toast from "react-hot-toast";
import api from "../../../lib/api";
import type {
  AddLevelSchemaType,
  EditLevelSchemaType,
} from "../schemas/playerLevel.schema";

export const fetchAllLevel = async (limit: number, page: number) => {
  try {
    const fetchAllLevelRes = await api.get(
      `/admin/playerlevel/findall?limit=${limit}&page=${page}`,
    );

    return fetchAllLevelRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const searchLevels = async (
  text: string,
  limit: number,
  page: number,
) => {
  try {
    const searchLevelRes = await api.get(
      `/admin/playerlevel/search?text=${text}&limit=${limit}&page=${page}`,
    );

    return searchLevelRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const fetchLevelById = async (mode_id: string) => {
  try {
    const fetchLevelRes = await api.get(`/admin/playerlevel/find/${mode_id}`);

    return fetchLevelRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const addLevel = async (data: AddLevelSchemaType) => {
  try {
    const addRes = await api.post(`/admin/playerlevel/create`, data);

    return addRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const editLevel = async (
  level_id: string,
  data: EditLevelSchemaType,
) => {
  try {
    const editLevelRes = await api.patch(
      `/admin/playerlevel/update/${level_id}`,
      data,
    );

    return editLevelRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const deleteLevel = async (level_id: string) => {
  try {
    const deleteRes = await api.delete(`/admin/playerlevel/delete/${level_id}`);

    return deleteRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};
