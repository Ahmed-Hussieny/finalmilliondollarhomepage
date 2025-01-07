import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import LogoSlice from "./LogosSlices";
import AuthSlice from "./authSlice";
import globalSlice from "./globalSlice";

export const Config = configureStore({
    reducer: {
        LogoData: LogoSlice,
        AuthData : AuthSlice,
        globalData: globalSlice
    },
});

export type AppDispatch = typeof Config.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();