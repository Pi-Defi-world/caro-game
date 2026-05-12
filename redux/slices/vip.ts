import axiosClient from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface IVIP {
  level: number;
  _id:string;
  price: number;
  benefits: string[];
  buttonText: string;
  users: {
    _id: string;
    username: string;
  }[];
}


interface VipState {
    vips: IVIP[];
    isLoading: boolean;
    error: string | null;
    isPurchasing:boolean
}

const initialState: VipState = {
    vips: [],
    isLoading: false,
    error: null,
    isPurchasing:false
}

export const fetchVips = createAsyncThunk("vip/fetchVips", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient("/vips", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;   
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch vips");
    }
})

export const purchaseVip = createAsyncThunk("vip/purchaseVip", async (vipId: string, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post(`/vips/purchase/${vipId}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to purchase vip");
    }
})

const vipSlice = createSlice({
    name: "vip",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVips.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchVips.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vips = action.payload;
            })
            .addCase(fetchVips.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(purchaseVip.pending, (state) => {
                state.error = null;
                state.isPurchasing = true;
            })
            .addCase(purchaseVip.fulfilled, (state, action) => {
                state.isPurchasing = false;
            })
            .addCase(purchaseVip.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isPurchasing = false;
            });
        
  },
});

export default vipSlice.reducer;