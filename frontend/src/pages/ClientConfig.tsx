import { FiPlus } from "react-icons/fi";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import BlockLoader from "../components/common/loader/BlockLoader";
import type { ClientConfigDoc } from "../features/client-config/client-config.type";
import ActionButtons from "../components/ui/ActionButtons";
import { fetchAllConfig } from "../features/client-config/services/client-config.service";

const ClientConfig = () => {
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [totalConfigs, setTotalConfigs] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [configs, setConfig] = useState<ClientConfigDoc[]>([]);

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
      headerName: "Client Build Version",
      type: "number",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "updateRequired",
      headerName: "Update Required",
      type: "number",
      width: 130,
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
      width: 130,
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
      width: 130,
      headerAlign: "left",
      align: "center",
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
        return <ActionButtons rowId={params.row.id} method={() => {}} />;
      },
    },
  ];

  // <==================== GetAllUsers OR SearchUser ====================>
  const findAllConfig = async () => {
    setLoading(true);
    const getAllConfigRes = await fetchAllConfig(
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

  //   const handleLevelSearch = (text: string = "") => {
  //     if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

  //     debounceTimerRef.current = setTimeout(async () => {
  //       await searchLevel(text);
  //     }, 500);
  //   };

  useEffect(() => {
    // handleLevelSearch(searchText);
    findAllConfig();
  }, [paginationModel, searchText]);

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
            // onClick={openAddDialog}
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
      </div>
    </div>
  );
};

export default ClientConfig;
