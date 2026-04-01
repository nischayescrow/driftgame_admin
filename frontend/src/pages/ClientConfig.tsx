import { FiPlus } from "react-icons/fi";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import BlockLoader from "../components/common/loader/BlockLoader";
import type { ClientConfigDoc } from "../features/client-config/client-config.type";
import ActionButtons from "../components/ui/ActionButtons";
import {
  addConfig,
  deleteConfig,
  editConfig,
  fetchConfigById,
  searchConfig,
} from "../features/client-config/services/client-config.service";
import MyDialog from "../components/ui/MyDialog";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  AddConfigSchema,
  EditConfigSchema,
  type AddConfigSchemaType,
  type EditConfigSchemaType,
} from "../features/client-config/schemas/client-config.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";

const ClientConfig = () => {
  let debounceTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [fetchingLevel, setFetchingLevel] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [totalConfigs, setTotalConfigs] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [configs, setConfig] = useState<ClientConfigDoc[]>([]);
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
      field: "clientBuildVersion",
      headerName: "Build Version",
      type: "number",
      headerAlign: "center",
      align: "center",
      width: 150,
    },
    {
      field: "updateRequired",
      headerName: "Update Required",
      type: "number",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <>
          {value === 0 && (
            <p className="text-green-600 font-semibold">Not required</p>
          )}

          {value === 1 && (
            <p className="text-orange-600 font-semibold">Update Required!</p>
          )}
        </>
      ),
    },
    {
      field: "currentStatus",
      headerName: "Current Status",
      type: "boolean",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <>
          {value === false && (
            <p className="text-green-600 font-semibold">Active</p>
          )}

          {value === true && (
            <p className="text-orange-600 font-semibold">Under maintenance!</p>
          )}
        </>
      ),
    },
    {
      field: "upcomingStatus",
      headerName: "Upcoming Status",
      type: "boolean",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <>
          {value === false && (
            <p className="text-green-600 font-semibold">Active</p>
          )}

          {value === true && (
            <p className="text-orange-600 font-semibold">Under maintenance!</p>
          )}
        </>
      ),
    },
    {
      field: "message",
      headerName: "Message",
      type: "string",
      width: 200,
      headerAlign: "left",
      align: "left",
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
  const searchAllConfig = async (txt: string) => {
    setLoading(true);
    const getAllConfigRes = await searchConfig(
      txt,
      paginationModel.pageSize,
      paginationModel.page,
    );

    setTimeout(() => {
      setLoading(false);
    }, 300);

    console.log("getAllConfigRes: ", getAllConfigRes);

    if (getAllConfigRes) {
      const fetchedModes: ClientConfigDoc[] = getAllConfigRes.data.data.map(
        (cnf: ClientConfigDoc) => {
          return {
            id: cnf.id,
            clientBuildVersion: cnf.clientBuildVersion,
            updateRequired: cnf.updateRequired,
            underMaintenance: cnf.underMaintenance,
            currentStatus: cnf.underMaintenance.currentStatus,
            upcomingStatus: cnf.underMaintenance.upcomingStatus,
            message: cnf.underMaintenance.message,
          };
        },
      );
      setTotalConfigs(getAllConfigRes.data.total);
      setConfig(fetchedModes);
    } else {
      setConfig([]);
    }
  };

  const handleConfigSearch = (text: string = "") => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      await searchAllConfig(text);
    }, 500);
  };

  useEffect(() => {
    handleConfigSearch(searchText);
  }, [paginationModel, searchText]);

  // <==================== Add user ====================>

  let {
    control: addConfigControl,
    handleSubmit: addConfigSubmit,
    reset: addConfigReset,
    formState: { errors: addConfigError },
  } = useForm({
    resolver: zodResolver(AddConfigSchema),
    defaultValues: {
      clientBuildVersion: "",
      updateRequired: false,
      currentStatus: false,
      upcomingStatus: false,
      message: "",
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    if (!adding) {
      setAddDialog(false);
      addConfigReset();
    }
  };

  const handleAddConfig = async (data: AddConfigSchemaType) => {
    console.log(data);
    setAdding(true);
    const addLevelRes = await addConfig(data);
    setTimeout(() => {
      setAdding(false);

      console.log(addLevelRes);

      if (addLevelRes && addLevelRes.status === 201) {
        toast.success(addLevelRes.data.message);
        handleConfigSearch(searchText);
        closeAddDialog();
      }
    }, 300);
  };

  // <==================== Edit Mode ====================>
  let {
    control: editConfigControl,
    handleSubmit: editConfigSubmit,
    reset: editConfigReset,
    setValue: editConfigSetVal,
    formState: { errors: editConfigError },
  } = useForm({
    resolver: zodResolver(EditConfigSchema),
    defaultValues: {
      clientBuildVersion: "",
      updateRequired: false,
      currentStatus: false,
      upcomingStatus: false,
      message: "",
    },
  });

  const openEditDialog = async (config_id: string) => {
    try {
      console.log("config_id: ", config_id);
      setFetchingLevel(true);
      if (config_id) {
        const fetchConfig = await fetchConfigById(config_id);

        console.log("fetchConfig: ", fetchConfig);
        if (fetchConfig && fetchConfig.data.data) {
          editConfigSetVal(
            "clientBuildVersion",
            fetchConfig.data.data.clientBuildVersion,
          );
          editConfigSetVal(
            "updateRequired",
            fetchConfig.data.data.updateRequired === 1 ? true : false,
          );
          editConfigSetVal(
            "currentStatus",
            fetchConfig.data.data.underMaintenance.currentStatus,
          );
          editConfigSetVal(
            "upcomingStatus",
            fetchConfig.data.data.underMaintenance.upcomingStatus,
          );
          editConfigSetVal(
            "message",
            fetchConfig.data.data.underMaintenance.message,
          );
        }
      }
    } catch (error: any) {
      console.log(error.status, error.response ? error.response.status : error);

      if (error.status !== 401 || error.response.status !== 401) {
        toast.error(
          error.response ? error.response.data.message : error.message,
        );
      }
    } finally {
      setFetchingLevel(false);
    }
  };

  const closeEditDialog = () => {
    if (!adding) {
      setEditDialog({
        status: false,
        actionType: null,
        id: null,
      });
      editConfigReset();
    }
  };

  const handleSaveConfig = async (data: EditConfigSchemaType) => {
    if (!editDialog.id) {
      toast.error("Config id do not found!");
      throw new Error("Config id do not found!");
    }

    console.log(data);
    setAdding(true);
    const editLevelRes = await editConfig(editDialog.id, data);
    setAdding(false);

    console.log(editLevelRes);

    if (editLevelRes && editLevelRes.status === 200) {
      toast.success(editLevelRes.data.message);
      handleConfigSearch(searchText);
      closeEditDialog();
    }
  };

  // <==================== Delete user ====================>
  const handleDeleteConfig = async () => {
    if (!editDialog.id) {
      toast.error("COnfig id do not found!");
      throw new Error("COnfig id do not found!");
    }

    setAdding(true);
    const delLevelRes = await deleteConfig(editDialog.id);
    setAdding(false);

    console.log(delLevelRes);

    if (delLevelRes && delLevelRes.status === 200) {
      toast.success(delLevelRes.data.message);
      handleConfigSearch(searchText);
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
          <p className="text-xl font-bold">Master Client Config</p>
          <p>Manage your client configs</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="bg-primary text-center cursor-pointer p-2 rounded-sm text-white flex items-center gap-1"
            onClick={openAddDialog}
          >
            <FiPlus />
            <span>Add Config</span>
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
                rows={configs}
                rowCount={totalConfigs}
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

        {/* Add Config dialog */}
        <MyDialog
          onClose={closeAddDialog}
          open={addDialog}
          headerText="Add Config"
        >
          <form
            className="w-lg p-7 bg-white rounded-sm shadow-md"
            onSubmit={addConfigSubmit(handleAddConfig)}
          >
            {/* Build Version */}
            <div className="mb-3">
              <Controller
                name="clientBuildVersion"
                control={addConfigControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      label="Build Version"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={(ele) => onChange(Number(ele.target.value))}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addConfigError.clientBuildVersion
                        ? addConfigError.clientBuildVersion.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            <p className="text-lg font-bold">Under maintenance:</p>

            {/* Update Required */}
            <div className="mb-3 flex items-center gap-4">
              <p className="">Update Required: </p>
              <Controller
                name="updateRequired"
                control={addConfigControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <Switch
                      checked={value ? true : false}
                      name={name}
                      onChange={onChange}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addConfigError.updateRequired
                        ? addConfigError.updateRequired.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Current Status */}
            <div className="mb-3 flex items-center gap-4">
              <p className="">Current Status: </p>

              <Controller
                name="currentStatus"
                control={addConfigControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <Switch
                      checked={value ? true : false}
                      name={name}
                      onChange={onChange}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addConfigError.currentStatus
                        ? addConfigError.currentStatus.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Upcoming Status */}
            <div className="mb-3 flex items-center gap-4">
              <p className="">Upcoming Status: </p>

              <Controller
                name="upcomingStatus"
                control={addConfigControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <Switch
                      checked={value ? true : false}
                      name={name}
                      onChange={onChange}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addConfigError.upcomingStatus
                        ? addConfigError.upcomingStatus.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Message */}
            <div className="mb-3">
              <Controller
                name="message"
                control={addConfigControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="Messsage"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {addConfigError.message
                        ? addConfigError.message.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Action buttons */}
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
                  {adding ? "Adding..." : "Add Config"}
                </div>
              </Button>
            </div>
          </form>
        </MyDialog>

        {/* Edit Config dialog */}
        <MyDialog
          onClose={closeEditDialog}
          open={editDialog.status && editDialog.actionType === "edit"}
          headerText="Edit Mode"
        >
          <div className="relative">
            {fetchingLevel && <BlockLoader />}

            <form
              className="w-lg p-7 bg-white rounded-sm shadow-md"
              onSubmit={editConfigSubmit(handleSaveConfig)}
            >
              {/* Build Version */}
              <div className="mb-3">
                <Controller
                  name="clientBuildVersion"
                  control={editConfigControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        label="Build Version"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={(ele) => onChange(Number(ele.target.value))}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editConfigError.clientBuildVersion
                          ? editConfigError.clientBuildVersion.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              <p className="text-lg font-bold">Under maintenance:</p>

              {/* Update Required */}
              <div className="mb-3 flex items-center gap-4">
                <p className="">Update Required: </p>
                <Controller
                  name="updateRequired"
                  control={editConfigControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <Switch
                        checked={value ? true : false}
                        name={name}
                        onChange={onChange}
                        slotProps={{ input: { "aria-label": "controlled" } }}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editConfigError.updateRequired
                          ? editConfigError.updateRequired.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Current Status */}
              <div className="mb-3 flex items-center gap-4">
                <p className="">Current Status: </p>

                <Controller
                  name="currentStatus"
                  control={editConfigControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <Switch
                        checked={value ? true : false}
                        name={name}
                        onChange={onChange}
                        slotProps={{ input: { "aria-label": "controlled" } }}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editConfigError.currentStatus
                          ? editConfigError.currentStatus.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Upcoming Status */}
              <div className="mb-3 flex items-center gap-4">
                <p className="">Upcoming Status: </p>

                <Controller
                  name="upcomingStatus"
                  control={editConfigControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <Switch
                        checked={value ? true : false}
                        name={name}
                        onChange={onChange}
                        slotProps={{ input: { "aria-label": "controlled" } }}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editConfigError.upcomingStatus
                          ? editConfigError.upcomingStatus.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Message */}
              <div className="mb-3">
                <Controller
                  name="message"
                  control={editConfigControl}
                  render={({ field: { onChange, value, name } }) => (
                    <>
                      <TextField
                        type="text"
                        fullWidth
                        size="small"
                        label="Messsage"
                        variant="outlined"
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={adding}
                      />
                      <p className="min-h-5 text-sm text-red-600">
                        {editConfigError.message
                          ? editConfigError.message.message
                          : ""}
                      </p>
                    </>
                  )}
                />
              </div>

              {/* Action buttons */}
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
                    {adding ? "Saving..." : "Save Config"}
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
          headerText="Delete Config"
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
                onClick={handleDeleteConfig}
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
                  {adding ? "Deleting..." : "Delete Config"}
                </div>
              </Button>
            </div>
          </div>
        </MyDialog>
      </div>
    </div>
  );
};

export default ClientConfig;
