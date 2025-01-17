import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);
export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData) => {
    const { data } = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data; // { url: "...", ... }
  }
);
export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (params) => {
    const { data } = await axios.get("/auth/me");
    return data;
  }
);
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, updates }) => {
	const { data } = await axios.patch(`/auth/update/${userId}`, updates); // або PUT, якщо оновлюємо весь об'єкт
    return data; // Повертає оновленого користувача
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuth.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
    [fetchAuthMe.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },

    [uploadAvatar.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [uploadAvatar.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [uploadAvatar.rejected]: (state) => {
      state.status = "failed";
      state.data = null;
    },


		[updateUser.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [updateUser.rejected]: (state) => {
      state.status = "failed";
      state.data = null;
    },

		
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
export const selectUserId = (state) => state.auth.data?._id;
