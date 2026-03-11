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

import {
  addMode,
  deleteMode,
  editMode,
  fetchModeById,
  searchModes,
} from "../features/gamemode/services/gameMode.service";
import {
  AddModeSchema,
  EditModeSchema,
  type AddModeSchemaType,
} from "../features/gamemode/schemas/gameMode.schema";
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

const PlayerLevel = () => {
  let debounceTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [fetchingLevel, setFetchingLevel] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [totalLevels, setTotalLevels] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [levels, setLevel] = useState<PlayerLevelDoc[]>([]);
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
      field: "level",
      headerName: "Level",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "xpToLevel",
      headerName: "XP to Level",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "displayName",
      headerName: "Display Name",
      type: "string",
      headerAlign: "left",
      align: "left",
      width: 210,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "string",
      width: 180,
      headerAlign: "left",
      align: "left",
      renderCell: (params) =>
        `${new Date(params.value).toLocaleString("en-IN")}`,
    },
    {
      field: "status",
      headerName: "Level status",
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
  const searchLevel = async (text: string = "") => {
    setLoading(true);
    const getAllLevelRes = await searchLevels(
      text,
      paginationModel.pageSize,
      paginationModel.page,
    );

    setTimeout(() => {
      setLoading(false);
    }, 300);

    console.log("getAllLevelRes: ", getAllLevelRes);

    if (getAllLevelRes) {
      const fetchedModes: PlayerLevelDoc[] = getAllLevelRes.data.data.map(
        (lvl: PlayerLevelDoc) => {
          return {
            id: lvl._id,
            level: lvl.level,
            xpToLevel: lvl.xpToLevel,
            displayName: lvl.displayName,
            status: lvl.status,
            createdAt: lvl.createdAt,
          };
        },
      );
      setTotalLevels(getAllLevelRes.data.total);
      setLevel(fetchedModes);
    } else {
      setLevel([]);
    }
  };

  const handleLevelSearch = (text: string = "") => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      await searchLevel(text);
    }, 500);
  };

  useEffect(() => {
    handleLevelSearch(searchText);
  }, [paginationModel, searchText]);

  // <==================== Add user ====================>
  const random = Math.ceil(Math.random() * 1000);
  let {
    control: addLevelControl,
    handleSubmit: addLevelSubmit,
    reset: addLevelReset,
    formState: { errors: addLevelError },
  } = useForm({
    resolver: zodResolver(AddLevelSchema),
    defaultValues: {
      level: random,
      xpToLevel: random * 10,
      displayName: `Level ${random}`,
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    if (!adding) {
      setAddDialog(false);
      addLevelReset();
    }
  };

  const handleAddLevel = async (data: AddLevelSchemaType) => {
    console.log(data);
    setAdding(true);
    const addLevelRes = await addLevel(data);
    setTimeout(() => {
      setAdding(false);

      console.log(addLevelRes);

      if (addLevelRes && addLevelRes.status === 201) {
        toast.success(addLevelRes.data.message);
        handleLevelSearch(searchText);
        closeAddDialog();
      }
    }, 300);
  };

  // <==================== Edit Mode ====================>
  let {
    control: editLevelControl,
    handleSubmit: editLevelSubmit,
    reset: editLevelReset,
    setValue: editLevelSetVal,
    formState: { errors: editLevelError },
  } = useForm({
    resolver: zodResolver(EditLevelSchema),
    defaultValues: {
      level: random,
      xpToLevel: random * 10,
      displayName: `Level ${random}`,
      status: 0,
    },
  });

  const openEditDialog = async (level_id: string) => {
    console.log("level_id: ", level_id);
    setFetchingLevel(true);
    if (level_id) {
      const fetchLevel = await fetchLevelById(level_id);

      console.log("fetchLevel: ", fetchLevel);
      if (fetchLevel && fetchLevel.data.data) {
        editLevelSetVal("level", fetchLevel.data.data.level);
        editLevelSetVal("xpToLevel", fetchLevel.data.data.xpToLevel);
        editLevelSetVal("displayName", fetchLevel.data.data.displayName);
        editLevelSetVal("status", fetchLevel.data.data.status);
      }
    }
    setFetchingLevel(false);
  };

  const closeEditDialog = () => {
    if (!adding) {
      setEditDialog({
        status: false,
        actionType: null,
        id: null,
      });
      editLevelReset();
    }
  };

  const handleSaveLevel = async (data: any) => {
    if (!editDialog.id) {
      toast.error("Level id do not found!");
      throw new Error("Level id do not found!");
    }

    console.log(data);
    setAdding(true);
    const editLevelRes = await editLevel(editDialog.id, data);
    setAdding(false);

    console.log(editLevelRes);

    if (editLevelRes && editLevelRes.status === 200) {
      toast.success(editLevelRes.data.message);
      handleLevelSearch(searchText);
      closeEditDialog();
    }
  };

  // <==================== Delete user ====================>
  const handleDeleteLevel = async () => {
    if (!editDialog.id) {
      toast.error("Level id do not found!");
      throw new Error("Level id do not found!");
    }

    setAdding(true);
    const delLevelRes = await deleteLevel(editDialog.id);
    setAdding(false);

    console.log(delLevelRes);

    if (delLevelRes && delLevelRes.status === 200) {
      toast.success(delLevelRes.data.message);
      handleLevelSearch(searchText);
      closeEditDialog();
    }
  };

  useEffect(() => {
    if (editDialog && editDialog.status && editDialog.id) {
      switch (editDialog.actionType) {
        case "edit": {
          openEditDialog(editDialog.id);
          break;
        }
        case "delete": {
          break;
        }
      }
    }
  }, [editDialog]);

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
          <p className="text-xl font-bold">Player Levels</p>
          <p>Manage your player levels</p>
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
            <span>Add Level</span>
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
            placeholder="Search for level..."
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
                rows={levels}
                rowCount={totalLevels}
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

        {/* Add Level dialog */}
        <MyDialog
          onClose={closeAddDialog}
          open={addDialog}
          headerText="Add Mode"
        >
          <form
            className="w-lg p-7 bg-white rounded-sm shadow-md"
            onSubmit={addLevelSubmit(handleAddLevel)}
          >
            {/* Level no. */}
            <div className="mb-3">
              <Controller
                name="level"
                control={addLevelControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      label="Level"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={(ele) => onChange(Number(ele.target.value))}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addLevelError.level ? addLevelError.level.message : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* XP to level */}
            <div className="mb-3">
              <Controller
                name="xpToLevel"
                control={addLevelControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      label="XP to level"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={(ele) => onChange(Number(ele.target.value))}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addLevelError.xpToLevel
                        ? addLevelError.xpToLevel.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Display Name */}
            <div className="mb-3">
              <Controller
                name="displayName"
                control={addLevelControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="Display Name"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addLevelError.displayName
                        ? addLevelError.displayName.message
                        : ""}
                    </p>
                  </>
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
                  {adding ? "Adding..." : "Add Level"}
                </div>
              </Button>
            </div>
          </form>
        </MyDialog>

        {/* Edit Level dialog */}
        <MyDialog
          onClose={closeEditDialog}
          open={editDialog.status && editDialog.actionType === "edit"}
          headerText="Edit Mode"
        >
          <div className="relative">
            {fetchingLevel && <BlockLoader />}

            <form
              className="w-lg p-7 bg-white rounded-sm shadow-md"
              onSubmit={editLevelSubmit(handleSaveLevel)}
            >
              {/* Level no. */}
              <div className="mb-3">
                <Controller
                  name="level"
                  control={editLevelControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        label="Level"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={(ele) => onChange(Number(ele.target.value))}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editLevelError.level
                          ? editLevelError.level.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* XP to level */}
              <div className="mb-3">
                <Controller
                  name="xpToLevel"
                  control={editLevelControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        label="XP to level"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={(ele) => onChange(Number(ele.target.value))}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editLevelError.xpToLevel
                          ? editLevelError.xpToLevel.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Display Name */}
              <div className="mb-3">
                <Controller
                  name="displayName"
                  control={editLevelControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="text"
                        fullWidth
                        size="small"
                        label="Display Name"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editLevelError.displayName
                          ? editLevelError.displayName.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Status */}
              <div className="mb-3">
                <Controller
                  name="status"
                  control={editLevelControl}
                  render={({ field: { onChange, value, name } }) => (
                    <FormControl fullWidth>
                      <InputLabel id="mode-status-select-label">
                        Level Status
                      </InputLabel>
                      <Select
                        name={name}
                        labelId="mode-status-select-label"
                        id="mode-status-select"
                        value={value}
                        label="Mode Status"
                        onChange={onChange}
                        disabled={adding}
                      >
                        <MenuItem value={0}>
                          <p className="text-slate-500 font-semibold">
                            Not Active
                          </p>
                        </MenuItem>
                        <MenuItem value={1}>
                          <p className="text-green-600 font-semibold">Active</p>
                        </MenuItem>

                        <MenuItem value={2}>
                          <p className="text-orange-600 font-semibold">
                            Deleted
                          </p>
                        </MenuItem>
                      </Select>
                      <p className="min-h-5 text-sm text-red-600">
                        {editLevelError.status
                          ? editLevelError.status.message
                          : ""}
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
                  onClick={closeEditDialog}
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
                    {adding ? "Saving..." : "Save Level"}
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </MyDialog>

        {/* Delete level confirmation */}
        <MyDialog
          onClose={closeEditDialog}
          open={editDialog.status && editDialog.actionType === "delete"}
          headerText="Delete Level"
        >
          <div className="w-lg p-7">
            <p className="mb-7 text-lg font-semibold">Are you sure?</p>

            {/* Action buttons */}
            <div className=" flex gap-7">
              <Button
                fullWidth
                type="button"
                variant="contained"
                color="error"
                onClick={closeEditDialog}
                disabled={adding}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                type="button"
                variant="contained"
                disabled={adding}
                onClick={handleDeleteLevel}
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
                  {adding ? "Deleting..." : "Delete Level"}
                </div>
              </Button>
            </div>
          </div>
        </MyDialog>
      </div>
    </div>
  );
};

export default PlayerLevel;
