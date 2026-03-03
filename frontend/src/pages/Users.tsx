import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { IoSearch } from "react-icons/io5";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

const Users = () => {
  const [actionAnc, setActionAnc] = useState<null | HTMLElement>(null);

  const openActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActionAnc(event.currentTarget);
  };

  const closeActions = () => {
    setActionAnc(null);
  };

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
    {
      field: "",
      headerName: "Actions",
      type: "number",
      width: 70,
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: () => (
        <div className="w-full h-full flex justify-center items-center">
          <button
            type="button"
            aria-controls={Boolean(actionAnc) ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(actionAnc) ? "true" : undefined}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              openActions(event);
            }}
            className="w-full h-full flex justify-center items-center cursor-pointer text-xl p-2"
          >
            <HiDotsVertical />
          </button>
          <Menu
            id="basic-menu"
            anchorEl={actionAnc}
            open={Boolean(actionAnc)}
            onClose={closeActions}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            <MenuItem onClick={closeActions}>View</MenuItem>
            <MenuItem onClick={closeActions}>Edit</MenuItem>
            <MenuItem onClick={closeActions}>Delete</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];

  const rows = [
    {
      id: "507f1f77bcf86cd799439011",
      first_name: "Aarav",
      last_name: "Sharma",
      email: "aarav.sharma94@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/44.jpg",
      status: 1,
    },
    {
      id: "507f191e810c19729de860ea",
      first_name: "Diya",
      last_name: "Patel",
      email: "diya.patel.27@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/12.jpg",
      status: 1,
    },
    {
      id: "507f1f77bcf86cd799439012",
      first_name: "Vihaan",
      last_name: "Kumar",
      email: "vihaan.k.2002@gmail.com",
      email_verified: false,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/67.jpg",
      status: 0,
    },
    {
      id: "507f191e810c19729de860eb",
      first_name: "Ananya",
      last_name: "Singh",
      email: "ananya.singh18@outlook.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/31.jpg",
      status: 1,
    },
    {
      id: "507f1f77bcf86cd799439013",
      first_name: "Arjun",
      last_name: "Mehta",
      email: "arjun.mehta05@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/19.jpg",
      status: 2,
    },
    {
      id: "507f191e810c19729de860ec",
      first_name: "Saanvi",
      last_name: "Reddy",
      email: "saanvi.reddy99@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/58.jpg",
      status: 1,
    },
    {
      id: "507f1f77bcf86cd799439014",
      first_name: "Reyansh",
      last_name: "Joshi",
      email: "reyansh.joshi.2001@yahoo.com",
      email_verified: false,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/8.jpg",
      status: 3,
    },
    {
      id: "507f191e810c19729de860ed",
      first_name: "Kiara",
      last_name: "Kapoor",
      email: "kiara.kapoor22@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/76.jpg",
      status: 1,
    },
    {
      id: "507f1f77bcf86cd799439015",
      first_name: "Kabir",
      last_name: "Khan",
      email: "kabir.khan.07@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/55.jpg",
      status: 1,
    },
    {
      id: "507f191e810c19729de860ee",
      first_name: "Myra",
      last_name: "Desai",
      email: "myra.desai2003@gmail.com",
      email_verified: false,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/41.jpg",
      status: 0,
    },
    {
      id: "507f1f77bcf86cd799439016",
      first_name: "Advik",
      last_name: "Yadav",
      email: "advik.yadav.23@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/92.jpg",
      status: 1,
    },
    {
      id: "507f191e810c19729de860ef",
      first_name: "Isha",
      last_name: "Thakur",
      email: "isha.thakur11@outlook.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/25.jpg",
      status: 2,
    },
    {
      id: "507f1f77bcf86cd799439017",
      first_name: "Ayaan",
      last_name: "Malhotra",
      email: "ayaan.malhotra98@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/36.jpg",
      status: 1,
    },
    {
      id: "507f191e810c19729de860f0",
      first_name: "Zara",
      last_name: "Rao",
      email: "zara.rao05@gmail.com",
      email_verified: true,
      picture: "https://xsgames.co/randomusers/assets/avatars/female/63.jpg",
      status: 1,
    },
    {
      id: "507f1f77bcf86cd799439018",
      first_name: "Rudra",
      last_name: "Tripathi",
      email: "rudra.tripathi.2000@gmail.com",
      email_verified: false,
      picture: "https://xsgames.co/randomusers/assets/avatars/male/29.jpg",
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
              disableRowSelectionOnClick
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
