import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import {
  addUser,
  deleteUser,
  editUser,
  fetchUserById,
  searchUsers,
} from "../features/user/services/user.service";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import BlockLoader from "../components/common/loader/BlockLoader";
import type { UserDoc } from "../features/user/user.type";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";

import {
  SignUpSchema,
  type SignUpSchemaType,
} from "../features/auth/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputAdornment from "@mui/material/InputAdornment";
import { IoEye, IoEyeOff } from "react-icons/io5";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";
import MyDialog from "../components/ui/MyDialog";
import ActionButtons from "../components/ui/ActionButtons";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  EditUserSchema,
  type EditUserSchemaType,
} from "../features/user/schemas/user.schema";
import Switch from "@mui/material/Switch";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  let debounceTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    status: boolean;
    actionType: "view" | "edit" | "delete" | null;
    user_id?: string | null;
  }>({
    status: false,
    actionType: null,
    user_id: null,
  });
  const [passEye, setPassEye] = useState(true);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 210 },
    {
      field: "picture",
      headerName: "Picture",
      type: "string",
      width: 70,
      align: "center",
      renderCell: (params) => (
        <div className="p-4 w-full h-full flex justify-center items-center">
          <Avatar
            alt="User picture"
            src={params.value}
            style={{
              width: 32,
              height: 32,
            }}
          />
        </div>
      ),
    },

    { field: "first_name", headerName: "First name", width: 130 },
    { field: "last_name", headerName: "Last name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      width: 200,
    },
    {
      field: "email_verified",
      headerName: "Email verified",
      type: "boolean",
      width: 130,
    },
    {
      field: "status",
      headerName: "Account status",
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

          {value === 2 && <p className="text-red-600 font-semibold">Blocked</p>}

          {value === 3 && (
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
  const searchUser = async (text: string = "") => {
    setLoading(true);
    const getAllUsersRes = await searchUsers(
      text,
      paginationModel.pageSize,
      paginationModel.page,
    );
    setTimeout(() => {
      setLoading(false);
    }, 300);
    // console.log("getAllUsersRes: ", getAllUsersRes);

    if (getAllUsersRes) {
      const fetchedUsers: UserDoc[] = getAllUsersRes.data.data.map(
        (usr: UserDoc) => {
          return {
            first_name: usr.first_name,
            last_name: usr.last_name,
            email: usr.email,
            email_verified: usr.email_verified,
            picture: usr.picture,
            status: usr.status,
            id: usr._id,
          };
        },
      );
      setTotalUsers(getAllUsersRes.data.total);
      setUsers(fetchedUsers);
    } else {
      setUsers([]);
    }
  };

  const handleUserSearch = (text: string = "") => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      await searchUser(text);
    }, 500);
  };

  useEffect(() => {
    handleUserSearch(searchText);
  }, [paginationModel, searchText]);

  // <==================== Add user ====================>
  const random = Math.ceil(Math.random() * 1000);

  let {
    control: addUserControl,
    handleSubmit: addUserSubmit,
    reset: addUserReset,
    formState: { errors: addUserError },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: `admin${random}`,
      last_name: "escrow",
      email: `admin${random}.escrow@gmail.com`,
      password: "Admin@2026",
    },
  });

  const openAddDialog = () => {
    setAddDialog(true);
  };

  const closeAddDialog = () => {
    if (!adding) {
      setAddDialog(false);
      addUserReset();
    }
  };

  const handlePassEye = () => {
    setPassEye(!passEye);
  };

  const handleAddUser = async (data: SignUpSchemaType) => {
    console.log(data);
    setAdding(true);
    const addUserRes = await addUser(data);
    setTimeout(() => {
      setAdding(false);

      console.log(addUserRes);

      if (addUserRes && addUserRes.status === 201) {
        toast.success(addUserRes.data.message);
        handleUserSearch(searchText);
        closeAddDialog();
      }
    }, 300);
  };

  // <==================== Edit user ====================>
  let {
    control: editUserControl,
    handleSubmit: editUserSubmit,
    reset: editUserReset,
    setValue: editUserSetVal,
    formState: { errors: editUserError },
  } = useForm<EditUserSchemaType>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      status: 0,
    },
  });

  const openEditDialog = async (user_id: string) => {
    console.log("user_id: ", user_id);
    setFetchingUser(true);
    if (user_id) {
      const fetchUser = await fetchUserById(user_id);

      console.log("fetchUser: ", fetchUser);
      if (fetchUser && fetchUser.data) {
        editUserSetVal("first_name", fetchUser.data.first_name);
        editUserSetVal("last_name", fetchUser.data.last_name);
        editUserSetVal("email", fetchUser.data.email);
        editUserSetVal("password", fetchUser.data.password);
        editUserSetVal("email_verified", fetchUser.data.email_verified);
        editUserSetVal("status", fetchUser.data.status);
      }
    }
    setFetchingUser(false);
  };

  const closeEditDialog = () => {
    if (!adding) {
      setEditDialog({
        status: false,
        actionType: null,
        user_id: null,
      });
      editUserReset();
    }
  };

  const handleSaveUser = async (data: any) => {
    if (!editDialog.user_id) {
      toast.error("User id do not found!");
      throw new Error("User id do not found!");
    }

    console.log(data);
    setAdding(true);
    const editUserRes = await editUser(editDialog.user_id, data);
    setAdding(false);

    console.log(editUserRes);

    if (editUserRes && editUserRes.status === 200) {
      toast.success(editUserRes.data.message);
      handleUserSearch(searchText);
      closeEditDialog();
    }
  };

  // <==================== Delete user ====================>
  const handleDeleteUser = async () => {
    if (!editDialog.user_id) {
      toast.error("User id do not found!");
      throw new Error("User id do not found!");
    }

    setAdding(true);
    const delUserRes = await deleteUser(editDialog.user_id);
    setAdding(false);

    console.log(delUserRes);

    if (delUserRes && delUserRes.status === 200) {
      toast.success(delUserRes.data.message);
      handleUserSearch(searchText);
      closeEditDialog();
    }
  };

  useEffect(() => {
    if (editDialog && editDialog.status && editDialog.user_id) {
      switch (editDialog.actionType) {
        case "view": {
          break;
        }
        case "edit": {
          openEditDialog(editDialog.user_id);
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
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className={`flex-1 flex flex-col px-6 pb-6`}>
        {/* Search */}
        <div className="relative m-4 ms-0">
          <input
            type="text"
            value={searchText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(event.target.value)
            }
            className=" border border-slate-200 rounded-sm p-1.5 px-10 w-sm placeholder:font-semibold placeholder:text-sm"
            placeholder="Search for user..."
          />

          <button
            type="button"
            className="h-full px-2.5 rounded-sm absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-105"
          >
            <IoSearch className="text-lg" />
          </button>
        </div>

        {/* User Data grid */}
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
                rows={users}
                rowCount={totalUsers}
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

      {/* Add User dialog */}
      <MyDialog onClose={closeAddDialog} open={addDialog} headerText="Add User">
        <form
          className="w-lg p-7 bg-white rounded-sm shadow-md"
          onSubmit={addUserSubmit(handleAddUser)}
        >
          {/* First name */}
          <div className="mb-3">
            <Controller
              name="first_name"
              control={addUserControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="text"
                    fullWidth
                    size="small"
                    label="First name"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addUserError.first_name
                      ? addUserError.first_name.message
                      : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Last name */}
          <div className="mb-3">
            <Controller
              name="last_name"
              control={addUserControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="text"
                    fullWidth
                    size="small"
                    label="Last name"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addUserError.last_name
                      ? addUserError.last_name.message
                      : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <Controller
              name="email"
              control={addUserControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    type="text"
                    fullWidth
                    size="small"
                    label="Email"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={adding}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addUserError.email ? addUserError.email.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Controller
              name="password"
              control={addUserControl}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Password"
                    type={passEye ? "text" : "password"}
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={adding}
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="start">
                            <button
                              type="button"
                              className="block p-2 text-xl text-black cursor-pointer disabled:text-[#e0e0e0]"
                              onClick={handlePassEye}
                              disabled={adding}
                            >
                              {passEye ? <IoEyeOff /> : <IoEye />}
                            </button>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        paddingRight: 0,
                      },
                    }}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {addUserError.password ? addUserError.password.message : ""}
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
                {adding ? "Adding..." : "Add User"}
              </div>
            </Button>
          </div>
        </form>
      </MyDialog>

      {/* Edit User dialog */}
      <MyDialog
        onClose={closeEditDialog}
        open={editDialog.status && editDialog.actionType === "edit"}
        headerText="Edit User"
      >
        <div className="relative">
          {fetchingUser && <BlockLoader />}

          <form
            className="w-lg p-7 bg-white rounded-sm shadow-md"
            onSubmit={editUserSubmit(handleSaveUser)}
          >
            {/* First name */}
            <div className="mb-3">
              <Controller
                name="first_name"
                control={editUserControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="First name"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {editUserError.first_name
                        ? editUserError.first_name.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Last name */}
            <div className="mb-3">
              <Controller
                name="last_name"
                control={editUserControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="Last name"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {editUserError.last_name
                        ? editUserError.last_name.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <Controller
                name="email"
                control={editUserControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      type="text"
                      fullWidth
                      size="small"
                      label="Email"
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {editUserError.email ? editUserError.email.message : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <Controller
                name="password"
                control={editUserControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <TextField
                      fullWidth
                      size="small"
                      label="Password"
                      type={passEye ? "text" : "password"}
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={onChange}
                      disabled={adding}
                      autoComplete="new-password"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="start">
                              <button
                                type="button"
                                className="block p-2 text-xl text-black cursor-pointer disabled:text-[#e0e0e0]"
                                onClick={handlePassEye}
                                disabled={adding}
                              >
                                {passEye ? <IoEyeOff /> : <IoEye />}
                              </button>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          paddingRight: 0,
                        },
                      }}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {editUserError.password
                        ? editUserError.password.message
                        : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Email Verified */}
            <div className="mb-3">
              <Controller
                name="email_verified"
                control={editUserControl}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <Switch
                      checked={value ? true : false}
                      name={name}
                      onChange={onChange}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                    />
                    <p className="min-h-5 text-sm text-red-600">
                      {editUserError.email ? editUserError.email.message : ""}
                    </p>
                  </>
                )}
              />
            </div>

            {/* Status */}
            <div className="mb-3">
              <Controller
                name="status"
                control={editUserControl}
                render={({ field: { onChange, value, name } }) => (
                  <FormControl fullWidth>
                    <InputLabel id="user-status-select-label">
                      Account Status
                    </InputLabel>
                    <Select
                      name={name}
                      labelId="user-status-select-label"
                      id="user-status-select"
                      value={value}
                      label="Account Status"
                      onChange={onChange}
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
                        <p className="text-red-600 font-semibold">Blocked</p>
                      </MenuItem>
                      <MenuItem value={3}>
                        <p className="text-orange-600 font-semibold">Deleted</p>
                      </MenuItem>
                    </Select>
                    <p className="min-h-5 text-sm text-red-600">
                      {editUserError.email ? editUserError.email.message : ""}
                    </p>
                  </FormControl>
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
                  {adding ? "Saving..." : "Save User"}
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
        headerText="Delete User"
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
              onClick={handleDeleteUser}
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
                {adding ? "Deleting..." : "Delete User"}
              </div>
            </Button>
          </div>
        </div>
      </MyDialog>
    </div>
  );
};

export default Users;
