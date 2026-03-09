import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";
import {
  SignUpSchema,
  type SignUpSchemaType,
} from "../features/auth/schemas/auth.schema";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
} from "../components/common/loader/loader.slice";
import toast from "react-hot-toast";
import { singUp } from "../features/auth/services/auth.service";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const random = Math.ceil(Math.random() * 1000);
  const [loginPassEye, setLoginPassEye] = useState(true);
  let {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: `admin${random}`,
      last_name: "escrow",
      email: `admin${random}.escrow@gmail.com`,
      password: "Admin@2026",
    },
  });

  const handleSignup = async (data: SignUpSchemaType) => {
    console.log(data);

    dispatch(startLoading());
    const signupRes = await singUp(data);
    setTimeout(() => dispatch(stopLoading()), 500);

    console.log("loginRes: ", signupRes);

    if (signupRes && signupRes.status === 201) {
      toast.success(signupRes.data?.message);
      navigate("/");
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
          onSubmit={handleSubmit(handleSignup)}
        >
          <div className="mb-10 flex flex-col items-center gap-y-1">
            <p className="text-lg font-semibold text-blue-800">
              Create New Account
            </p>
            <p className="font-medium text-slate-400">
              Sign up to continue to DriftKing
            </p>
          </div>

          {/* Firstname */}
          <div className="mb-3">
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Firstname"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {errors.first_name ? errors.first_name.message : ""}
                  </p>
                </>
              )}
            />
          </div>

          {/* Lastname */}
          <div className="mb-3">
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Lastname"
                    variant="outlined"
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                  <p className="min-h-5 text-sm text-red-600">
                    {errors.last_name ? errors.last_name.message : ""}
                  </p>
                </>
              )}
            />
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
              Sign Up
            </Button>
          </div>

          <p className="flex justify-center items-center gap-1">
            <span className="text-sm font-semibold">
              Already have an account ?
            </span>
            <NavLink
              to="/"
              className="text-sm font-semibold underline text-blue-700"
            >
              Signin
            </NavLink>
          </p>

          {/* <div className="my-5 flex items-center gap-x-3">
            <p className="w-1/2 h-px bg-slate-300"></p>
            <p className="text-nowrap">Create account with</p>
            <p className="w-1/2 h-px bg-slate-300"></p>
          </div>

          <div className="flex justify-center items-center">
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

export default SignUp;
