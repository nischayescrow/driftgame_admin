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
import type { GameModeDoc } from "../features/gamemode/gameMode.type";
import {
  AddModeSchema,
  EditModeSchema,
  type AddModeSchemaType,
} from "../features/gamemode/schemas/gameMode.schema";

const PlayerLevel = () => {
  let debounceTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [fetchingMode, setFetchingMode] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [totalModes, setTotalModes] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [modes, setModes] = useState<GameModeDoc[]>([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    status: boolean;
    actionType: "view" | "edit" | "delete" | null;
    mode_id?: string | null;
  }>({
    status: false,
    actionType: null,
    mode_id: null,
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", type: "string", width: 210 },
    { field: "level", headerName: "Level", type: "number", width: 130 },
    {
      field: "xpToLevel",
      headerName: "XP to Level",
      type: "number",
      width: 130,
    },
    {
      field: "displayName",
      headerName: "Display Name",
      type: "string",
      width: 210,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      type: "string",
      width: 200,
    },
    {
      field: "map",
      headerName: "Map",
      type: "string",
      width: 130,
    },

    {
      field: "status",
      headerName: "Mode status",
      type: "number",
      width: 130,
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
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return <ActionButtons rowId={params.row.id} method={setEditDialog} />;
      },
    },
  ];

  // <==================== GetAllUsers OR SearchUser ====================>
  const searchMode = async (text: string = "") => {
    setLoading(true);
    const getAllModesRes = await searchModes(
      text,
      paginationModel.pageSize,
      paginationModel.page,
    );

    setTimeout(() => {
      setLoading(false);
    }, 300);

    console.log("getAllModesRes: ", getAllModesRes);

    if (getAllModesRes) {
      const fetchedModes: GameModeDoc[] = getAllModesRes.data.data.map(
        (md: GameModeDoc) => {
          return {
            id: md._id,
            name: md.name,
            identity: md.identity,
            purpose: md.purpose,
            map: md.map,
            players: md.players,
            status: md.status,
          };
        },
      );
      setTotalModes(getAllModesRes.data.total);
      setModes(fetchedModes);
    } else {
      setModes([]);
    }
  };

  const handleModeSearch = (text: string = "") => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      await searchMode(text);
    }, 500);
  };

  useEffect(() => {
    handleModeSearch(searchText);
  }, [paginationModel, searchText]);

  // <==================== Add user ====================>
  const random = Math.ceil(Math.random() * 1000);
  let {
    control: addModeControl,
    handleSubmit: addModeSubmit,
    reset: addModeReset,
    formState: { errors: addModeError },
  } = useForm({
    resolver: zodResolver(AddModeSchema),
    defaultValues: {
      name: `Training Mode ${random}`,
      identity: `Training Mode Indentity ${random}`,
      purpose: `Training Mode Purpose ${random}`,
      map: `Training map ${random}`,
      players: 1,
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    if (!adding) {
      setAddDialog(false);
      addModeReset();
    }
  };

  const handleAddMode = async (data: AddModeSchemaType) => {
    console.log(data);
    setAdding(true);
    const addModeRes = await addMode(data);
    setTimeout(() => {
      setAdding(false);

      console.log(addModeRes);

      if (addModeRes && addModeRes.status === 201) {
        toast.success(addModeRes.data.message);
        handleModeSearch(searchText);
        closeAddDialog();
      }
    }, 300);
  };

  // <==================== Edit Mode ====================>
  let {
    control: editModeControl,
    handleSubmit: editModeSubmit,
    reset: editModeReset,
    setValue: editModeSetVal,
    formState: { errors: editModeError },
  } = useForm({
    resolver: zodResolver(EditModeSchema),
    defaultValues: {
      name: "",
      identity: "",
      purpose: "",
      map: "",
      players: 0,
      status: 0,
    },
  });

  const openEditDialog = async (mode_id: string) => {
    console.log("mode_id: ", mode_id);
    setFetchingMode(true);
    if (mode_id) {
      const fetchMode = await fetchModeById(mode_id);

      console.log("fetchMode: ", fetchMode);
      if (fetchMode && fetchMode.data) {
        editModeSetVal("name", fetchMode.data.name);
        editModeSetVal("identity", fetchMode.data.identity);
        editModeSetVal("purpose", fetchMode.data.purpose);
        editModeSetVal("map", fetchMode.data.map);
        editModeSetVal("players", fetchMode.data.players);
        editModeSetVal("status", fetchMode.data.status);
      }
    }
    setFetchingMode(false);
  };

  const closeEditDialog = () => {
    if (!adding) {
      setEditDialog({
        status: false,
        actionType: null,
        mode_id: null,
      });
      editModeReset();
    }
  };

  const handleSaveMode = async (data: any) => {
    if (!editDialog.mode_id) {
      toast.error("User id do not found!");
      throw new Error("User id do not found!");
    }

    console.log(data);
    setAdding(true);
    const editUserRes = await editMode(editDialog.mode_id, data);
    setAdding(false);

    console.log(editUserRes);

    if (editUserRes && editUserRes.status === 200) {
      toast.success(editUserRes.data.message);
      handleModeSearch(searchText);
      closeEditDialog();
    }
  };

  // <==================== Delete user ====================>
  const handleDeleteMode = async () => {
    if (!editDialog.mode_id) {
      toast.error("Mode id do not found!");
      throw new Error("Mode id do not found!");
    }

    setAdding(true);
    const delModeRes = await deleteMode(editDialog.mode_id);
    setAdding(false);

    console.log(delModeRes);

    if (delModeRes && delModeRes.status === 200) {
      toast.success(delModeRes.data.message);
      handleModeSearch(searchText);
      closeEditDialog();
    }
  };

  useEffect(() => {
    if (editDialog && editDialog.status && editDialog.mode_id) {
      switch (editDialog.actionType) {
        case "edit": {
          openEditDialog(editDialog.mode_id);
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
          <p className="text-xl font-bold">Users</p>
          <p>Manage your users</p>
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
            <span>Add Mode</span>
          </button>
        </div>
      </div>

      {/* Game Mode Table */}
      <div className={`flex-1 flex flex-col px-6 pb-6`}>
        {/* Search mode.. */}
        <div className="relative m-4 ms-0">
          <input
            type="text"
            value={searchText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(event.target.value)
            }
            className=" border border-slate-200 rounded-sm p-1.5 px-10 w-sm placeholder:font-semibold placeholder:text-sm"
            placeholder="Search for mode..."
          />

          <button
            type="button"
            className="h-full px-2.5 rounded-sm absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-105"
          >
            <IoSearch className="text-lg" />
          </button>
        </div>

        {/* Game Mode Data grid */}
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
                rows={modes}
                rowCount={totalModes}
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

        {/* Add Mode dialog */}
        <MyDialog
          onClose={closeAddDialog}
          open={addDialog}
          headerText="Add Mode"
        >
          <form
            className="w-lg p-7 bg-white rounded-sm shadow-md"
            onSubmit={addModeSubmit(handleAddMode)}
          >
            {/* Mode Name */}
            <div className="mb-3">
              <Controller
                name="name"
                control={addModeControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="Name"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addModeError.name ? addModeError.name.message : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Identity */}
            <div className="mb-3">
              <Controller
                name="identity"
                control={addModeControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      label="Identity"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addModeError.identity
                        ? addModeError.identity.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Purpose */}
            <div className="mb-3">
              <Controller
                name="purpose"
                control={addModeControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      label="Purpose"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addModeError.purpose ? addModeError.purpose.message : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Map */}
            <div className="mb-3">
              <Controller
                name="map"
                control={addModeControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="Map"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addModeError.map ? addModeError.map.message : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Players */}
            <div className="mb-3">
              <Controller
                name="players"
                control={addModeControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      label="Players"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={(ele) => onChange(Number(ele.target.value))}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addModeError.players ? addModeError.players.message : ""}
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
                  {adding ? "Adding..." : "Add Mode"}
                </div>
              </Button>
            </div>
          </form>
        </MyDialog>

        {/* Edit Mode dialog */}
        <MyDialog
          onClose={closeEditDialog}
          open={editDialog.status && editDialog.actionType === "edit"}
          headerText="Edit Mode"
        >
          <div className="relative">
            {fetchingMode && <BlockLoader />}

            <form
              className="w-lg p-7 bg-white rounded-sm shadow-md"
              onSubmit={editModeSubmit(handleSaveMode)}
            >
              {/* Mode Name */}
              <div className="mb-3">
                <Controller
                  name="name"
                  control={editModeControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="text"
                        fullWidth
                        size="small"
                        label="Name"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editModeError.name ? editModeError.name.message : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Identity */}
              <div className="mb-3">
                <Controller
                  name="identity"
                  control={editModeControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="text"
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                        label="Identity"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editModeError.identity
                          ? editModeError.identity.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Purpose */}
              <div className="mb-3">
                <Controller
                  name="purpose"
                  control={editModeControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="text"
                        multiline
                        rows={3}
                        fullWidth
                        size="small"
                        label="Purpose"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editModeError.purpose
                          ? editModeError.purpose.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Map */}
              <div className="mb-3">
                <Controller
                  name="map"
                  control={editModeControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="text"
                        fullWidth
                        size="small"
                        label="Map"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editModeError.map ? editModeError.map.message : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Players */}
              <div className="mb-3">
                <Controller
                  name="players"
                  control={editModeControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        label="Players"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={(ele) => onChange(Number(ele.target.value))}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editModeError.players
                          ? editModeError.players.message
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
                  control={editModeControl}
                  render={({ field: { onChange, value, name } }) => (
                    <FormControl fullWidth>
                      <InputLabel id="mode-status-select-label">
                        Mode Status
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
                        {editModeError.status
                          ? editModeError.status.message
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
                    {adding ? "Saving..." : "Save Mode"}
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </MyDialog>

        {/* Delete confirmation */}
        <MyDialog
          onClose={closeEditDialog}
          open={editDialog.status && editDialog.actionType === "delete"}
          headerText="Delete Mode"
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
                onClick={handleDeleteMode}
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
                  {adding ? "Deleting..." : "Delete Mode"}
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
