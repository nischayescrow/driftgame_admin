import toast from "react-hot-toast";
import api from "../../../lib/api";
import type {
  AddModeSchemaType,
  EditModeSchemaType,
} from "../schemas/gameMode.schema";

export const fetchAllMode = async (limit: number, page: number) => {
  try {
    const fetchAllUserRes = await api.get(
      `/admin/gamemode/findall?limit=${limit}&page=${page}`,
    );

    return fetchAllUserRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const searchModes = async (
  text: string,
  limit: number,
  page: number,
) => {
  try {
    const searchModesRes = await api.get(
      `/admin/gamemode/search?text=${text}&limit=${limit}&page=${page}&all=true`,
    );

    return searchModesRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const fetchModeById = async (mode_id: string) => {
  try {
    const fetchModeRes = await api.get(
      `/admin/gamemode/find/${mode_id}?all=true`,
    );

    return fetchModeRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const addMode = async (data: AddModeSchemaType) => {
  try {
    const addRes = await api.post(`/admin/gamemode/create`, data);

    return addRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const editMode = async (mode_id: string, data: EditModeSchemaType) => {
  try {
    const editModeRes = await api.patch(
      `/admin/gamemode/update/${mode_id}`,
      data,
    );

    return editModeRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const deleteMode = async (mode_id: string) => {
  try {
    const deleteRes = await api.delete(`/admin/gamemode/delete/${mode_id}`);

    return deleteRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};
