import { FiPlus } from "react-icons/fi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

const GameMode = () => {
  const modes = [
    {
      id: "69a57af8609d31d68d9493f3",
      name: "Training",
      identity:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      purpose:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      map: "Desert Road",
      players: 1,
      status: 1,
    },
    {
      id: "69a57af8609d31d68d9493f3",
      name: "Training",
      identity:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      purpose:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      map: "Desert Road",
      players: 1,
      status: 1,
    },
    {
      id: "69a57af8609d31d68d9493f3",
      name: "Training",
      identity:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      purpose:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      map: "Desert Road",
      players: 1,
      status: 1,
    },
    {
      id: "69a57af8609d31d68d9493f3",
      name: "Training",
      identity:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      purpose:
        "TLorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, sapiente repudiandae commodi voluptates accusantium suscipit quisquam praesentium reprehenderit dolores maiores! Atque vero ullam delectus aut voluptas aliquam magni hic amet.each drift scoring system",
      map: "Desert Road",
      players: 1,
      status: 1,
    },
  ];

  const [actionAnc, setActionAnc] = useState<null | HTMLElement>(null);

  const openActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActionAnc(event.currentTarget);
  };

  const closeActions = () => {
    setActionAnc(null);
  };

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
          <p className="text-xl font-bold">Game Modes</p>
          <p>Manage your game modes</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="bg-primary text-center cursor-pointer p-2 rounded-sm text-white flex items-center gap-1"
          >
            <FiPlus />
            <span>Add Mode</span>
          </button>
        </div>
      </div>

      {/* Game mode grid */}
      <div className="max-w-[calc(100vw-255px)] flex-1 px-6 pb-6">
        <TableContainer
          component={Paper}
          sx={{
            "&.MuiTableContainer-root": {
              boxShadow: "1px 1px 1px 2px rgba(0,0,0,0.1)",
              overflowX: "auto",
            },
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Id</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Identity</TableCell>
                <TableCell align="left">Purpose</TableCell>
                <TableCell align="left">Map</TableCell>
                <TableCell align="left">Playes</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modes &&
                modes.map((mode, inx) => (
                  <TableRow
                    key={`game-mode-${inx}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className="hover:bg-slate-200 cursor-pointer"
                  >
                    <TableCell component="th" scope="row">
                      {mode.id}
                    </TableCell>
                    <TableCell align="left">{mode.name}</TableCell>
                    <TableCell align="left">
                      {mode.identity.length > 30
                        ? `${mode.identity.slice(0, 30)}...`
                        : mode.identity}
                    </TableCell>
                    <TableCell align="left">
                      {" "}
                      {mode.purpose.length > 30
                        ? `${mode.purpose.slice(0, 30)}...`
                        : mode.purpose}
                    </TableCell>
                    <TableCell align="center">
                      {" "}
                      {mode.map.length > 30
                        ? `${mode.map.slice(0, 30)}...`
                        : mode.map}
                    </TableCell>
                    <TableCell align="center">{mode.players}</TableCell>
                    <TableCell align="center">
                      {
                        <>
                          {mode.status === 0 && (
                            <p className="text-slate-500 font-semibold">
                              Not Active
                            </p>
                          )}

                          {mode.status === 1 && (
                            <p className="text-green-600 font-semibold">
                              Active
                            </p>
                          )}

                          {mode.status === 2 && (
                            <p className="text-red-600 font-semibold">
                              Blocked
                            </p>
                          )}

                          {mode.status === 3 && (
                            <p className="text-orange-600 font-semibold">
                              Deleted
                            </p>
                          )}
                        </>
                      }
                    </TableCell>
                    <TableCell align="center">
                      <div className="w-full h-full">
                        <button
                          type="button"
                          aria-controls={
                            Boolean(actionAnc)
                              ? "gamemode-action-menu"
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            Boolean(actionAnc) ? "true" : undefined
                          }
                          onClick={openActions}
                          className="cursor-pointer text-xl p-2"
                        >
                          <HiDotsVertical />
                        </button>
                        <Menu
                          id="gamemode-action-menu"
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default GameMode;
