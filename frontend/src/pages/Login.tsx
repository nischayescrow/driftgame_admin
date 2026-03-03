import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router-dom";

const Login = () => {
  let {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const handleLogin = (data: any) => {};

  return (
    <div className="myContainer flex-1 flex justify-end items-center">
      <div className="w-lg ">
        <div className="flex flex-col items-center gap-y-1 mb-7">
          <p className="text-4xl font-bold text-white">DriftKing</p>
          <p className="text-xl text-white">Admin Panel</p>
        </div>
        <form
          className=" p-7 bg-white rounded-sm shadow-md"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="mb-10 flex flex-col items-center gap-y-1">
            <p className="text-lg font-semibold text-blue-800">Welcom Back!</p>
            <p className="font-medium text-slate-400">
              Sign in to continue to DriftKing
            </p>
          </div>

          {/* Email */}
          <div className="mb-3">
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                  <p className="min-h-5"></p>
                </>
              )}
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Password"
                    type="password"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                  <p className="min-h-5"></p>
                </>
              )}
            />
          </div>

          <div className="mb-7">
            <Button fullWidth type="submit" variant="contained">
              Sign in
            </Button>
          </div>

          <p className="flex justify-center items-center gap-1">
            <span className="text-sm font-semibold">
              Don't have an account ?
            </span>
            <NavLink
              to="/signup"
              className="text-sm font-semibold underline text-blue-700"
            >
              Signup
            </NavLink>
          </p>

          {/* <div className="my-5 flex items-center gap-x-3">
            <p className="w-1/2 h-px bg-slate-300"></p>
            <p className="text-nowrap">Sign in with</p>
            <p className="w-1/2 h-px bg-slate-300"></p>
          </div> */}

          {/* <div className="flex justify-center items-center">
            <button
              type="button"
              className="p-1 border border-slate-300 rounded-sm cursor-pointer hover:bg-slate-100"
            >
              <FcGoogle className="w-8 h-8" />
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
