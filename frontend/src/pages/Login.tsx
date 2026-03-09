import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LoginSchema,
  type LoginSchemaType,
} from "../features/auth/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputAdornment from "@mui/material/InputAdornment";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";
import { login } from "../features/auth/services/auth.service";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/user.slice";
import toast from "react-hot-toast";
import {
  startLoading,
  stopLoading,
} from "../components/common/loader/loader.slice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginPassEye, setLoginPassEye] = useState(true);
  let {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin.escrow@gmail.com",
      password: "admin@2026",
    },
  });

  const handleLogin = async (data: any) => {
    console.log(data);
    dispatch(startLoading());
    const loginRes = await login(data);
    setTimeout(() => dispatch(stopLoading()), 500);

    console.log("loginRes: ", loginRes);

    if (loginRes && loginRes.status === 200) {
      dispatch(
        setUser({
          access_token: loginRes.data.access_token,
          data: {
            id: loginRes.data.user.id,
            first_name: loginRes.data.user.first_name,
            last_name: loginRes.data.user.last_name,
            email: loginRes.data.user.email,
            email_verified: loginRes.data.user.email_verified,
            picture: loginRes.data.user.picture,
            status: loginRes.data.user.status,
          },
        }),
      );
      toast.success(loginRes.data?.message);
      navigate("/dashboard");
    }
  };

  const handleLoginEye = () => {
    setLoginPassEye(!loginPassEye);
  };

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
                    type="text"
                    fullWidth
                    size="small"
                    label="Email"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {errors.email ? errors.email.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Password */}
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
                    type={loginPassEye ? "text" : "password"}
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="start">
                            <button
                              type="button"
                              className="block p-2 text-xl text-black cursor-pointer"
                              onClick={handleLoginEye}
                            >
                              {loginPassEye ? <IoEyeOff /> : <IoEye />}
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
                    {errors.password ? errors.password.message : ""}
                  </p>
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
