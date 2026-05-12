import axiosClient from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface ICharacter {
    _id: string;
    image: string;
    name: string;
    benefit: string[];
    price: number;
    quantity: number;
    remaining: number;
    createdAt: Date;
    updatedAt: Date;
  }

export interface INFT {
    character: ICharacter; 
    name: string; 
    owner: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}


interface CharcterState {
    characters: ICharacter[];
    myNfts: INFT[];
    isLoading: boolean;
    error: string | null;
    isPurchasing:boolean
}

const initialState: CharcterState = {
    characters: [],
    myNfts: [],
    isLoading: false,
    error: null,
    isPurchasing:false
}

export const fetchCharacters = createAsyncThunk("characters/fetchCharacters", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient("/characters", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;   
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch pets");
    }
})

export const purchaseCharatcer = createAsyncThunk("characters/purchaseCharatcer", async (charcterId: string, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.post(`/characters/purchase/${charcterId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return {
            charcterId,
            nft: response.data,
            character: response.data.character
        };
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to purchase vip");
    }
})

export const fetchMyCharactersNFTs = createAsyncThunk("character/fetchMyCharacter/me", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.get("/characters/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;   
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error?.response?.data.message );
    }
})


const characterSlice = createSlice({
    name: "characters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacters.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.characters = action.payload;
            })
            .addCase(fetchCharacters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(purchaseCharatcer.pending, (state) => {
                state.error = null;
                state.isPurchasing = true;
            })
            .addCase(purchaseCharatcer.fulfilled, (state, action) => {
                state.isPurchasing = false;
                const characterIndex = state.characters.findIndex(char => char._id === action.payload.charcterId)
                if(characterIndex!== -1){
                    state.characters[characterIndex] = action.payload.character;
                }
            })
            .addCase(purchaseCharatcer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isPurchasing = false;
            })
             .addCase(fetchMyCharactersNFTs.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchMyCharactersNFTs.fulfilled, (state, action) => {
                state.myNfts = action.payload;
            })
            .addCase(fetchMyCharactersNFTs.rejected, (state, action) => {
                state.error = action.payload as string;
            })
        
  },
});

export default characterSlice.reducer;