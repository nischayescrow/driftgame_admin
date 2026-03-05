import { createSlice } from "@reduxjs/toolkit";

export interface UserDataType {
  access_token: string | undefined;
  data:
    | {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        email_verified: boolean;
        picture: string;
        status: number;
      }
    | undefined;
}

const initialState: UserDataType = {
  access_token: undefined,
  data: undefined,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("action.payload: ", action.payload);
      state.access_token = action.payload.access_token;
      state.data = action.payload.data;
    },
    removeUser: (state) => {
      state.access_token = initialState.access_token;
      state.data = initialState.data;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
