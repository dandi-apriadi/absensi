import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001",
    withCredentials: true, // Setel secara global
});

const getInitialSidebarState = () => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
        // Check if user preference is saved in localStorage
        const savedState = localStorage.getItem('sidebarOpen');
        if (savedState !== null) {
            return JSON.parse(savedState);
        }
        // Default to open on desktop, closed on mobile
        return window.innerWidth >= 1024;
    }
    // Default to true for SSR
    return true;
};

const initialState = {
    user: null,
    baseURL: "http://localhost:5001",
    // baseURL: api,
    microPage: "unset", // default value of microPage
    homepage: "unset",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    sidebarOpen: getInitialSidebarState(), // Smart default based on screen size and user preference
};

// Thunk untuk mendapatkan data pengguna
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await api.get("/api/shared/me");
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk untuk logout pengguna
export const logoutUser = createAsyncThunk("user/logoutUser", async (_, thunkAPI) => {
    try {
        await api.delete("/api/shared/logout");
        return null;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk untuk login pengguna
export const loginUser = createAsyncThunk("user/loginUser", async (user, thunkAPI) => {
    try {
        const response = await api.post("/api/shared/login", user);
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk untuk register pengguna
export const registerUser = createAsyncThunk("user/register", async (userData, thunkAPI) => {
    try {
        const response = await api.post("/api/shared/register", userData);
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Slice Redux untuk otentikasi
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState,
        setMicroPage: (state, action) => {
            state.microPage = action.payload;
        },        // Sidebar actions with localStorage persistence
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebarOpen', JSON.stringify(state.sidebarOpen));
            }
        },
        openSidebar: (state) => {
            state.sidebarOpen = true;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebarOpen', JSON.stringify(true));
            }
        },
        closeSidebar: (state) => {
            state.sidebarOpen = false;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebarOpen', JSON.stringify(false));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Logout User
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = null; // Clear user data on logout
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, setMicroPage, toggleSidebar, openSidebar, closeSidebar } = authSlice.actions;

export default authSlice.reducer;