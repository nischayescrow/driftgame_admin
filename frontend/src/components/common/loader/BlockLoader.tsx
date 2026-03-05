import CircularProgress from "@mui/material/CircularProgress";

const BlockLoader = () => {
  return (
    <div className="min-w-full min-h-full z-50 absolute inset-0 flex justify-center items-center bg-white">
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

export default BlockLoader;
