import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import BlockLoader from "../components/common/loader/BlockLoader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import MyDialog from "../components/ui/MyDialog";
import ActionButtons from "../components/ui/ActionButtons";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { PlayerLevelDoc } from "../features/playerlevel/playerLevel.type";
import {
  addLevel,
  deleteLevel,
  editLevel,
  fetchLevelById,
  searchLevels,
} from "../features/playerlevel/services/playerLevel.service";
import {
  AddLevelSchema,
  EditLevelSchema,
  type AddLevelSchemaType,
} from "../features/playerlevel/schemas/playerLevel.schema";
import { addCar, searchCars } from "../features/car/services/car.service";
import {
  AddCarSchema,
  type AddCarSchemaType,
} from "../features/car/schemas/car.schema";

const Car = () => {
  let debounceTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [fetchingCar, setFetchingCar] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [totalCars, setTotalCars] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [cars, setCars] = useState<PlayerLevelDoc[]>([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    status: boolean;
    actionType: "view" | "edit" | "delete" | null;
    id: string | null;
  }>({
    status: false,
    actionType: null,
    id: null,
  });

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      type: "string",
      headerAlign: "left",
      align: "left",
      width: 210,
    },
    {
      field: "name",
      headerName: "Name",
      type: "string",
      headerAlign: "left",
      align: "left",
      width: 210,
    },
    {
      field: "top_speed",
      headerName: "Top speed",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "engine",
      headerName: "Engine",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
    },

    {
      field: "breaking",
      headerName: "Breaking",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "fuel",
      headerName: "Fuel",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "locked",
      headerName: "Locked",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
      renderCell: ({ value }) => (
        <>
          {value === 0 && (
            <p className="text-slate-500 font-semibold">Not Active</p>
          )}

          {value === 1 && (
            <p className="text-green-600 font-semibold">Active</p>
          )}

          {value === 2 && (
            <p className="text-orange-600 font-semibold">Deleted</p>
          )}
        </>
      ),
    },
    {
      field: "unlocked_at_level",
      headerName: "Unlocked at level",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "price_in_key",
      headerName: "Price in key",
      type: "string",
      headerAlign: "left",
      align: "left",
      width: 200,
    },
    {
      field: "price_in_coin",
      headerName: "Price in coin",
      type: "string",
      headerAlign: "left",
      align: "left",
      width: 200,
    },
    {
      field: "offer_percentage",
      headerName: "Offer (%)",
      type: "string",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "status",
      headerName: "Car status",
      type: "number",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <>
          {value === 0 && (
            <p className="text-slate-500 font-semibold">Not Active</p>
          )}

          {value === 1 && (
            <p className="text-green-600 font-semibold">Active</p>
          )}

          {value === 2 && (
            <p className="text-orange-600 font-semibold">Deleted</p>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return <ActionButtons rowId={params.row.id} method={setEditDialog} />;
      },
    },
  ];

  // <==================== GetAllUsers OR SearchUser ====================>
  const searchCar = async (text: string = "") => {
    setLoading(true);
    const getAllCarsRes = await searchCars(
      text,
      paginationModel.pageSize,
      paginationModel.page,
    );

    setTimeout(() => {
      setLoading(false);
    }, 300);

    console.log("getAllCarsRes: ", getAllCarsRes);

    if (getAllCarsRes) {
      setTotalCars(getAllCarsRes.data.total);
      setCars(getAllCarsRes.data.data);
    } else {
      setCars([]);
    }
  };

  const handleCarSearch = (text: string = "") => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      await searchCar(text);
    }, 500);
  };

  useEffect(() => {
    handleCarSearch(searchText);
  }, [paginationModel, searchText]);

  // // <==================== Add user ====================>
  const random = Math.ceil(Math.random() * 1000);
  let {
    control: addCarControl,
    handleSubmit: addCarSubmit,
    reset: addCarReset,
    formState: { errors: addCarError },
  } = useForm({
    resolver: zodResolver(AddCarSchema),
    defaultValues: {
      name: "",
      top_speed: 0,
      engine: 0,
      breaking: 0,
      fuel: 0,
      locked: 0,
      unlocked_at_level: 0,
      price_in_key: 0,
      price_in_coin: 0,
      offer_percentage: 0,
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    if (!adding) {
      setAddDialog(false);
      addCarReset();
    }
  };

  const handleAddCar = async (data: AddCarSchemaType) => {
    console.log(data);
    setAdding(true);
    const addLevelRes = await addCar(data);
    setTimeout(() => {
      setAdding(false);

      console.log(addLevelRes);

      if (addLevelRes && addLevelRes.status === 201) {
        toast.success(addLevelRes.data.message);
        handleCarSearch(searchText);
        closeAddDialog();
      }
    }, 300);
  };

  // // <==================== Edit Mode ====================>
  // let {
  //   control: editLevelControl,
  //   handleSubmit: editLevelSubmit,
  //   reset: editLevelReset,
  //   setValue: editLevelSetVal,
  //   formState: { errors: editLevelError },
  // } = useForm({
  //   resolver: zodResolver(EditLevelSchema),
  //   defaultValues: {
  //     level: random,
  //     xpToLevel: random * 10,
  //     displayName: `Level ${random}`,
  //     status: 0,
  //   },
  // });

  // const openEditDialog = async (level_id: string) => {
  //   console.log("level_id: ", level_id);
  //   setFetchingLevel(true);
  //   if (level_id) {
  //     const fetchLevel = await fetchLevelById(level_id);

  //     console.log("fetchLevel: ", fetchLevel);
  //     if (fetchLevel && fetchLevel.data.data) {
  //       editLevelSetVal("level", fetchLevel.data.data.level);
  //       editLevelSetVal("xpToLevel", fetchLevel.data.data.xpToLevel);
  //       editLevelSetVal("displayName", fetchLevel.data.data.displayName);
  //       editLevelSetVal("status", fetchLevel.data.data.status);
  //     }
  //   }
  //   setFetchingLevel(false);
  // };

  // const closeEditDialog = () => {
  //   if (!adding) {
  //     setEditDialog({
  //       status: false,
  //       actionType: null,
  //       id: null,
  //     });
  //     editLevelReset();
  //   }
  // };

  // const handleSaveLevel = async (data: any) => {
  //   if (!editDialog.id) {
  //     toast.error("Level id do not found!");
  //     throw new Error("Level id do not found!");
  //   }

  //   console.log(data);
  //   setAdding(true);
  //   const editLevelRes = await editLevel(editDialog.id, data);
  //   setAdding(false);

  //   console.log(editLevelRes);

  //   if (editLevelRes && editLevelRes.status === 200) {
  //     toast.success(editLevelRes.data.message);
  //     handleLevelSearch(searchText);
  //     closeEditDialog();
  //   }
  // };

  // // <==================== Delete user ====================>
  // const handleDeleteLevel = async () => {
  //   if (!editDialog.id) {
  //     toast.error("Level id do not found!");
  //     throw new Error("Level id do not found!");
  //   }

  //   setAdding(true);
  //   const delLevelRes = await deleteLevel(editDialog.id);
  //   setAdding(false);

  //   console.log(delLevelRes);

  //   if (delLevelRes && delLevelRes.status === 200) {
  //     toast.success(delLevelRes.data.message);
  //     handleLevelSearch(searchText);
  //     closeEditDialog();
  //   }
  // };

  // useEffect(() => {
  //   if (editDialog && editDialog.status && editDialog.id) {
  //     switch (editDialog.actionType) {
  //       case "edit": {
  //         openEditDialog(editDialog.id);
  //         break;
  //       }
  //       case "delete": {
  //         break;
  //       }
  //     }
  //   }
  // }, [editDialog]);

  return (
    <div className="flex-1 flex flex-col">
      {/* header */}
      <div
        className="m-6 p-4 flex items-center justify-between mb-5 rounded-sm"
        style={{
          boxShadow: "1px 1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <p className="text-xl font-bold">Cars</p>
          <p>Manage your player cars</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="bg-primary text-center cursor-pointer p-2 rounded-sm text-white flex items-center gap-1"
          >
            <LuFilter />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="bg-primary text-center cursor-pointer p-2 rounded-sm text-white flex items-center gap-1"
          >
            <span>Import</span>
          </button>
          <button
            type="button"
            className="bg-primary text-center cursor-pointer p-2 rounded-sm text-white flex items-center gap-1"
            onClick={openAddDialog}
          >
            <FiPlus />
            <span>Add Car</span>
          </button>
        </div>
      </div>

      {/* Player level Table */}
      <div className={`flex-1 flex flex-col px-6 pb-6`}>
        {/* Search level.. */}
        <div className="relative m-4 ms-0">
          <input
            type="text"
            value={searchText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(event.target.value)
            }
            className=" border border-slate-200 rounded-sm p-1.5 px-10 w-sm placeholder:font-semibold placeholder:text-sm"
            placeholder="Search for cars..."
          />

          <button
            type="button"
            className="h-full px-2.5 rounded-sm absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-105"
          >
            <IoSearch className="text-lg" />
          </button>
        </div>

        {/* Player level Data grid */}
        <div className="relative flex flex-1 border border-slate-200 rounded-sm">
          {loading ? (
            <BlockLoader />
          ) : (
            <Paper
              sx={{
                "&.MuiPaper-root": {
                  flex: 1,
                  boxShadow: "1px 1px 1px 2px rgba(0,0,0,0.1)",
                  maxWidth: "100%",
                  overflowX: "auto",
                },
              }}
            >
              <DataGrid
                rows={cars}
                rowCount={totalCars}
                columns={columns}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                checkboxSelection
                sx={{ border: 0 }}
              />
            </Paper>
          )}
        </div>
      </div>

      {/* Add Level dialog */}
      <MyDialog onClose={closeAddDialog} open={addDialog} headerText="Add Car">
        <form
          className="w-lg p-7 bg-white rounded-sm shadow-md"
          onSubmit={addCarSubmit(handleAddCar)}
        >
          {/* Name */}
          <div className="mb-3">
            <Controller
              name="name"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="string"
                    fullWidth
                    size="small"
                    label="Name"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.name ? addCarError.name.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Top speed */}
          <div className="mb-3">
            <Controller
              name="top_speed"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Top speed"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.top_speed ? addCarError.top_speed.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Engine */}
          <div className="mb-3">
            <Controller
              name="engine"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Engine"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.engine ? addCarError.engine.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Breaking */}
          <div className="mb-3">
            <Controller
              name="breaking"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Breaking"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.breaking ? addCarError.breaking.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Fuel */}
          <div className="mb-3">
            <Controller
              name="fuel"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Fuel"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.fuel ? addCarError.fuel.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Unlocked at level */}
          <div className="mb-3">
            <Controller
              name="unlocked_at_level"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Unlocked at level"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.unlocked_at_level
                      ? addCarError.unlocked_at_level.message
                      : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Price in key */}
          <div className="mb-3">
            <Controller
              name="price_in_key"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Price in key"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.price_in_key
                      ? addCarError.price_in_key.message
                      : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Price in coin */}
          <div className="mb-3">
            <Controller
              name="price_in_coin"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Price in coin"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.price_in_coin
                      ? addCarError.price_in_coin.message
                      : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Offer percentage */}
          <div className="mb-3">
            <Controller
              name="offer_percentage"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    label="Offer (%)"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={(ele) => onChange(Number(ele.target.value))}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.offer_percentage
                      ? addCarError.offer_percentage.message
                      : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <Controller
              name="locked"
              control={addCarControl}
              render={({ field: { onChange, value, name } }) => (
                <FormControl fullWidth>
                  <InputLabel id="car-locked-select-label">Locked</InputLabel>
                  <Select
                    name={name}
                    labelId="car-locked-select-label"
                    value={value}
                    label="Locked"
                    size="small"
                    onChange={onChange}
                    disabled={adding}
                  >
                    <MenuItem value={0}>
                      <p className="text-slate-500 font-semibold">Locked</p>
                    </MenuItem>
                    <MenuItem value={1}>
                      <p className="text-green-600 font-semibold">Unlocked</p>
                    </MenuItem>
                  </Select>
                  <p className="min-h-5 text-sm text-red-600">
                    {addCarError.locked ? addCarError.locked.message : ""}
                  </p>
                </FormControl>
              )}
            />
          </div>

          <div className="mb-7 flex gap-7">
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="error"
              onClick={closeAddDialog}
              disabled={adding}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={adding}
            >
              <div className="flex items-center gap-2">
                {adding && (
                  <CircularProgress
                    size="20px"
                    sx={{
                      "&.MuiCircularProgress-root": {
                        animationDuration: "500ms",
                        color: "white",
                      },
                    }}
                  />
                )}
                {adding ? "Adding..." : "Add Car"}
              </div>
            </Button>
          </div>
        </form>
      </MyDialog>
    </div>
  );
};

export default Car;
