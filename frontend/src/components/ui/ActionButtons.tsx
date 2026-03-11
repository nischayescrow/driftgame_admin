import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

const ActionButtons = ({
  rowId,
  method,
}: {
  rowId: string;
  method: React.Dispatch<
    React.SetStateAction<{
      status: boolean;
      actionType: "view" | "edit" | "delete" | null;
      id: string | null;
    }>
  >;
}) => {
  const [actionAnc, setActionAnc] = useState<null | HTMLElement>(null);

  const openActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActionAnc(event.currentTarget);
  };

  const closeActions = () => {
    setActionAnc(null);
  };
  const handleBtnAction = (actionType: "view" | "edit" | "delete" | null) => {
    closeActions();
    method({
      status: true,
      actionType,
      id: rowId,
    });
  };

  return (
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
        {/* <MenuItem onClick={() => handleBtnAction("view")}>View</MenuItem> */}
        <MenuItem onClick={() => handleBtnAction("edit")}>Edit</MenuItem>
        <MenuItem onClick={() => handleBtnAction("delete")}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default ActionButtons;
