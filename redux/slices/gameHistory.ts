import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '@/lib/axios';

export interface IGame {
  game: string;
  username: string;
  wager: number;
  multiplier: number;
  payout: number;
  currency: string;
  isPositive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

interface PayoutState {
    gameHistories: IGame[]; 
    isLoading: boolean;
    error: string | null;
  }
  
  const initialState: PayoutState = {
    gameHistories: [], 
    isLoading: false,
    error: null,
  };

export const fetchGameHistories = createAsyncThunk(
  'games/fetchGameHistories',
  async () => {
    const response = await axiosClient.get('/game');
    return response.data;
  }
);

export const fetchGameHistory = createAsyncThunk("gameHistory/fetchGameHistory", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/game-history");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch game history");
  }
});

const gameHistorySlice = createSlice({
    name: 'gameHistory',
    initialState,
    reducers: {
      addNewHistory: (state, action) => {
        const exists = state.gameHistories.some((game) => game._id.toString() === action.payload._id.toString())
        if (!exists) {
          // Add new game to the beginning of the array
          state.gameHistories.unshift(action.payload)
          // Keep only the last 100 games
          if (state.gameHistories.length > 100) {
            state.gameHistories = state.gameHistories.slice(0, 100)
          }
        } else {
          console.log(`Game with ID ${action.payload._id} already exists in history, skipping`)
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchGameHistories.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchGameHistories.fulfilled, (state, action) => {
          state.isLoading = false;
          state.gameHistories = action.payload
        })
    },
  });
export const { addNewHistory } = gameHistorySlice.actions;

export default gameHistorySlice.reducer;
