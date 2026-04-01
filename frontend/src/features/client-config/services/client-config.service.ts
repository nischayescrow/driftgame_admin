import toast from "react-hot-toast";
import api from "../../../lib/api";
import type {
  AddConfigSchemaType,
  EditConfigSchemaType,
} from "../schemas/client-config.schema";

export const searchConfig = async (
  text: string,
  limit: number,
  page: number,
) => {
  try {
    const fetchAllConfigRes = await api.get(
      `/admin/client-config/search?text=${text}&limit=${limit}&page=${page}`,
    );

    return fetchAllConfigRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const fetchConfigById = async (config_id: string) => {
  try {
    const fetchRes = await api.get(`/admin/client-config/find/${config_id}`);

    return fetchRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const addConfig = async (data: AddConfigSchemaType) => {
  try {
    const payload = {
      clientBuildVersion: data.clientBuildVersion,
      updateRequired: data.updateRequired ? 1 : 0,
      underMaintenance: {
        currentStatus: data.currentStatus,
        upcomingStatus: data.upcomingStatus,
        message: data.message,
      },
    };
    const addRes = await api.post(`/admin/client-config/create`, payload);

    return addRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const editConfig = async (
  config_id: string,
  data: EditConfigSchemaType,
) => {
  try {
    const payload = {
      clientBuildVersion: data.clientBuildVersion,
      updateRequired: data.updateRequired ? 1 : 0,
      underMaintenance: {
        currentStatus: data.currentStatus,
        upcomingStatus: data.upcomingStatus,
        message: data.message,
      },
    };

    const editRes = await api.patch(
      `/admin/client-config/update/${config_id}`,
      payload,
    );

    return editRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const deleteConfig = async (config_id: string) => {
  try {
    const deleteRes = await api.delete(
      `/admin/client-config/delete/${config_id}`,
    );

    return deleteRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};
