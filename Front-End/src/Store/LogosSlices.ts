import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LogoEntry, LogosData } from "../interfaces";

export const getPixels = createAsyncThunk<LogosData>("Logos/getPixels", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/pixel/getPixels`,{
        headers: {
            "ngrok-skip-browser-warning": "true",
        }
    });
    return data;
});

export const getGridImage = createAsyncThunk("Logos/getGridImage", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/gridImage/pixels_image.svg`,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return data;
});

export const getGridTempImage = createAsyncThunk("Logos/getGridTempImage", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/gridImage/pixels_temp_image.svg`,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return data;
});

export const getPixelByRowAndCol = createAsyncThunk("Logos/getPixelByRowAndCol", async ({ row, col }: { row: string, col: string }) => {
    try {
    const {data} = await axios.get(`${import.meta.env.VITE_SERVER_LINK}/pixel/getPixelByRowAndCol?row=${row}&col=${col}`,{
        headers: {
            'Content-Type': 'application/json',
        }
    });
    // console.log(data)
    return data;
    } catch (error) {
        console.log(error)
        return error;
    }
});

export const addPixel = createAsyncThunk<LogoEntry, { apiData: FormData }>("Logos/addPixel", async ({ apiData }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/pixel/addPixel`, apiData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "ngrok-skip-browser-warning": "true",
            }
        });
        console.log(data)
        return data;
    }
    catch (error) {
        return error;
    }
});

export const addPixelWithoutPayment = createAsyncThunk<LogoEntry, { apiData: FormData }>("Logos/addPixelWithoutPayment", async ({ apiData }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_LINK}/pixel/addPixelWithoutPayment`, apiData, {
            headers: {
                "Content-Type": "multipart/form-data",
                accesstoken: localStorage.getItem('token'),
                "ngrok-skip-browser-warning": "true",
            }
        });
        return data;
    }
    catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data || error.message);
        } else {
            return rejectWithValue(error);
        }
    }
});

export const updateLogo = createAsyncThunk<LogoEntry, { apiData: FormData; row:string; col:string }>("Logos/updateLogo", async ({ col,row, apiData }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_SERVER_LINK}/pixel/updatePixel?col=${col}&row=${row}`, apiData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                accesstoken: localStorage.getItem('token'),
                "ngrok-skip-browser-warning": "true",
            }
        });
        return data;
    }
    catch (error) {
        return error;
    }
});

export const deleteLogo = createAsyncThunk<LogoEntry, {  row:string; col:string }>("Logos/deleteLogo", async ({  col,row, }) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_SERVER_LINK}/pixel/deletePixel?col=${col}&row=${row}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                accesstoken: localStorage.getItem('token'),
                "ngrok-skip-browser-warning": "true",
            }
        });
        return data;
    }
    catch (error) {
        return error;
    }
});

const initialState: {
    Logos: LogoEntry[];
    numberOfPixelsUsed: number
} = {
    Logos: [],
    numberOfPixelsUsed: 0
};
const LogoSlice = createSlice({
    name: "Logos",
    initialState,
    reducers: {
        changePixelNumber: (state, action) => {
            state.numberOfPixelsUsed = action.payload
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getPixels.fulfilled, (state, { payload }) => {
            state.Logos = payload.logos;
            state.numberOfPixelsUsed = payload.numberOfPixelsUsed;
        });
        builder.addCase(getPixels.rejected, (state) => {
            state.Logos = [];
        });

        builder.addCase(addPixel.fulfilled, () => {
        });
        builder.addCase(addPixel.rejected, (state) => {
            state.Logos = [];
        });

        builder.addCase(addPixelWithoutPayment.fulfilled, () => {
        });
        builder.addCase(addPixelWithoutPayment.rejected, (state) => {
            state.Logos = [];
        });
        
        builder.addCase(updateLogo.fulfilled, () => {
        });
        builder.addCase(updateLogo.rejected, (state) => {
            state.Logos = [];
        });
        
        //getGridImage
        builder.addCase(getGridImage.fulfilled, () => {
        });
        builder.addCase(getGridImage.rejected, (state) => {
            state.Logos = [];
        });

        //getGridTempImage
        builder.addCase(getGridTempImage.fulfilled, () => {
        });
        builder.addCase(getGridTempImage.rejected, (state) => {
            state.Logos = [];
        });
        // getPixelByRowAndCol
        builder.addCase(getPixelByRowAndCol.fulfilled, () => {
        });
        builder.addCase(getPixelByRowAndCol.rejected, (state) => {
            state.Logos = [];
        });
    }
})

export default LogoSlice.reducer;
export const { changePixelNumber } = LogoSlice.actions;