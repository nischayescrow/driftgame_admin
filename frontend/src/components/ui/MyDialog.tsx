import Dialog from "@mui/material/Dialog";
import { type ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

const MyDialog = ({
  children,
  open,
  onClose,
  headerText,
}: {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  headerText: string;
}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <div className="flex flex-col">
        {/* header */}
        <div
          className={`bg-primary text-white flex justify-between items-center p-4`}
        >
          <p className="font-semibold text-lg">{headerText}</p>
          <button
            type="button"
            className="p-2 text-xl cursor-pointer"
            onClick={onClose}
          >
            <IoMdClose />
          </button>
        </div>

        {children}
      </div>
    </Dialog>
  );
};

export default MyDialog;
