import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: "global",
    initialState:{
        loading: true,
        toasting: {
            message: "",
            type: ""
        }
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setToast: (state, action) => {
            state.toasting = action.payload;
        }
    }
})

export default globalSlice.reducer;
export const { setLoading, setToast } = globalSlice.actions;