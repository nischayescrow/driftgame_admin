import toast from "react-hot-toast";
import api from "../../../lib/api";
import type {
  AddCarSchemaType,
  EditCarSchemaType,
} from "../schemas/car.schema";

export const fetchAllCars = async (limit: number, page: number) => {
  try {
    const fetchAllCarsRes = await api.get(
      `/admin/car/findall?limit=${limit}&page=${page}`,
    );

    return fetchAllCarsRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const searchCars = async (text: string, limit: number, page: number) => {
  try {
    const searchCarRes = await api.get(
      `/admin/car/search?text=${text}&limit=${limit}&page=${page}`,
    );

    return searchCarRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const fetchCarById = async (mode_id: string) => {
  try {
    const fetchCarRes = await api.get(`/admin/car/find/${mode_id}?all=true`);

    return fetchCarRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const addCar = async (data: AddCarSchemaType) => {
  try {
    const addRes = await api.post(`/admin/car/create`, data);

    return addRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const editCar = async (level_id: string, data: EditCarSchemaType) => {
  try {
    const editLevelRes = await api.patch(`/admin/car/update/${level_id}`, data);

    return editLevelRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};

export const deleteCar = async (car_id: string) => {
  try {
    const deleteRes = await api.delete(`/admin/car/delete/${car_id}`);

    return deleteRes;
  } catch (error: any) {
    console.log(error.status, error.response ? error.response.status : error);

    if (error.status !== 401 || error.response.status !== 401) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
};
