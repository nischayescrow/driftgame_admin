import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <div className="w-screen h-screen z-1500 fixed inset-0 flex justify-center items-center bg-white">
      <div>
        <CircularProgress
          size="40px"
          sx={{
            "&.MuiCircularProgress-root": {
              animationDuration: "500ms",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
