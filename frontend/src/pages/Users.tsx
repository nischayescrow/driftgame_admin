import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { IoSearch } from "react-icons/io5";

const Users = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 210 },
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
  ];

  const rows = [
    {
      id: "69a044dbf6d4952f45ab154d1",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 0,
    },
    {
      id: "69a044dbf6d4952f45ab154d2",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 1,
    },
    {
      id: "69a044dbf6d4952f45ab1543",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 2,
    },
    {
      id: "69a044dbf6d4952f45ab1545",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 3,
    },
    {
      id: "69a044dbf6d4952f45ab154d1",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 0,
    },
    {
      id: "69a044dbf6d4952f45ab154d2",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 1,
    },
    {
      id: "69a044dbf6d4952f45ab1543",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 2,
    },
    {
      id: "69a044dbf6d4952f45ab1545",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 3,
    },
    {
      id: "69a044dbf6d4952f45ab154d1",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 0,
    },
    {
      id: "69a044dbf6d4952f45ab154d2",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 1,
    },
    {
      id: "69a044dbf6d4952f45ab1543",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 2,
    },
    {
      id: "69a044dbf6d4952f45ab1545",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 3,
    },
  ];

  const handleUserSearch = () => {};

  const paginationModel = { page: 0, pageSize: 5 };
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
          >
            <FiPlus />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="max-w-[calc(100vw-255px)] flex-1 flex flex-col px-6 pb-6">
        {/* Search */}
        <div className="relative m-4 ms-0">
          <input
            type="text"
            onChange={handleUserSearch}
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

        <div className="flex-1">
          <Paper
            sx={{
              "&.MuiPaper-root": {
                height: "100%",
                flex: 1,
                boxShadow: "1px 1px 1px 2px rgba(0,0,0,0.1)",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Users;
