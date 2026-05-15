import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//Declaring initial state of user
const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
};

//Created asyn thunk for registration user -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const registerUser = createAsyncThunk(
    "/auth/register",

    async (formData) => {
        const response = await axios.post(
            "http://localhost:5000/api/auth/register",
            formData,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);


//Created asyn thunk for login user -- used to simplify writing asynchronous logic (like API calls) in Redux. ✔ avoid writing action types and creators manually
export const loginUser = createAsyncThunk(
    "/auth/login",

    async (formData) => {
        const response = await axios.post(
            "http://localhost:5000/api/auth/login",
            formData,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);


//Created asyn thunk for logout user -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const logoutUser = createAsyncThunk(
    "/auth/logout",

    async () => {
        const response = await axios.post(
            "http://localhost:5000/api/auth/logout",
            {},
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);


//Created asyn thunk for middleware -- used to simplify writing asynchronous logic (like API calls) in Redux.✔ avoid writing action types and creators manually
export const checkAuth = createAsyncThunk(
    "/auth/checkauth",

    async () => {
        const response = await axios.get(
            "http://localhost:5000/api/auth/check-auth",
            {
                withCredentials: true,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
            }
        );

        return response.data;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => { },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action);

                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;


