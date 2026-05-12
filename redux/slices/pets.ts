import axiosClient from "@/lib/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface IPET {
    image: string;
    name: string;
    benefit: string[];
    price: number;
    multiplier: number,
    quantity: number,
    remaining: number,
    _id:string,
    id:string,
    createdAt: Date,
    updatedAt: Date
}


export interface IPetNFT {
  _id: string;
  pet:IPET
  name: string;
  owner: string;
  mode: 'active' | 'inactive';
    activationTime: string | null;
    activationCount: number;
  feedCount: number;
  lastFed: string | null;
      level: number,
  upgradeFee:number;
  multiplier: number;
  createdAt: string;
  updatedAt: string;
}



interface PetState {
    pets: IPET[];
    myPets: IPetNFT[];
    petActivated: boolean;
    isLoading: boolean;
    error: string | null;
    isPurchasing: boolean;
}

const initialState: PetState = {
    pets: [],
    petActivated: false,
    myPets: [],
    isLoading: false,
    error: null,
    isPurchasing: false
}

interface ITransferData{
    petId: string;
    toUsername:string
}
export const fetchPets = createAsyncThunk("pets/fetchPets", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/pets");
    return response.data;   
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch pets");
  }
});


export const purchasePet = createAsyncThunk("pets/purchasePet", async (petId: string, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.post(`/pets/purchase/${petId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return {
            petId,
            nft: response.data.nft,
            pet: response.data.pet
        };
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to purchase vip");
    }
})

export const fetchMyPetsNFTs = createAsyncThunk("pets/fetchMyPets/me", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.get("/pets/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;   
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch pets");
    }
})

export const activatePetNFTs = createAsyncThunk("pets/activatePet", async (petId: string, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.post(`/pets/${petId}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return {
            petId,
            pet:response.data
        };   
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch pets");
    }
})


export const transferPetNFTs = createAsyncThunk("pets/activatePet", async (data:ITransferData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.post(`/pets/${data.petId}/transfer`, {
            toUsername: data.toUsername
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;   
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch pets");
    }
})


const petsSlice = createSlice({
    name: "pets",
    initialState,
    reducers: {
        deactivatePetNft: (state, action:PayloadAction<string>) => {
             const pet = state.myPets.find(p=>p._id === action.payload)
                const petIndex = state.myPets.findIndex(pe => pe._id === pet?._id);

                if (petIndex !== -1) {
                    state.myPets[petIndex].mode = "inactive";
                    state.petActivated = false
                }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pets = action.payload;
            })
            .addCase(fetchPets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(purchasePet.pending, (state) => {
                state.error = null;
                state.isPurchasing = true;
            })
            .addCase(purchasePet.fulfilled, (state, action) => {
                state.isPurchasing = false;

                const petIndex = state.pets.findIndex(pe => pe._id === action.payload.petId)

                if(petIndex !== -1){
                    state.pets[petIndex] = action.payload.pet;
                }
            })
            .addCase(purchasePet.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isPurchasing = false;
            })
            .addCase(activatePetNFTs.pending, (state) => {
                state.error = null;
            })
            .addCase(activatePetNFTs.fulfilled, (state, action) => {
                const pet = action.payload.pet;
                const petIndex = state.myPets.findIndex(pe => pe._id === pet._id);

                if (petIndex !== -1) {
                    state.myPets[petIndex] = pet;
                    state.petActivated = true;
                } 
            })
            .addCase(activatePetNFTs.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(fetchMyPetsNFTs.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchMyPetsNFTs.fulfilled, (state, action) => {
                state.myPets = action.payload;
            })
            .addCase(fetchMyPetsNFTs.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            
        
  },
});

export const {deactivatePetNft} = petsSlice.actions
export default petsSlice.reducer;