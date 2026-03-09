import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/user/user.slice";
import loaderSlice from "../components/common/loader/loader.slice";

const AppStore = configureStore({
  reducer: {
    user: userSlice,
    loader: loaderSlice,
  },
});

export type RootState = ReturnType<typeof AppStore.getState>;
export type AppDispatch = typeof AppStore.dispatch;

export default AppStore;
