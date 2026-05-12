import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export interface IGame {
  id: number;
  name: string;
  url: string;
  provider: string;
  image: string;
  category?: string;
}

interface GameState {
  games: IGame[];
  upcomingGames: IGame[];
}

const initialState: GameState = {
  games: [
    {
      id: 1,
      name: "CARO",
      url: "/games/caro",
      provider: "GameFi",
      image:"/games/caro3.png",
    }
  ],
  upcomingGames: [
    {
      id: 2,
      name: "Who's Millionaire",
      provider: "GameFi",
      category: "originals",
      url: "#",
      image:"/games/millionaire.png",
    },
    {
      id: 3,
      name: "CHECKER",
      provider: "GameFi",
      category: "originals",
      url: "#",
      image:"/games/checker5.png",
    },
    {
      id: 6,
      name: "DICE DUEL",
      provider: "GameFi",
      category: "originals",
      url: "#",
      image:"/games/dice.png",
    },
    {
      id: 7,
      name: "POKER",
      provider: "GameFi",
      category: "originals",
      url: "#",
      image:"/games/poker.png",
    }
  ],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGames(state, action: PayloadAction<IGame[]>) {
      state.games = action.payload;
    },
    addGame(state, action: PayloadAction<IGame>) {
      state.games.unshift(action.payload);
    },
    removeGame(state, action: PayloadAction<number>) {
      state.games = state.games.filter((game) => game.id !== action.payload);
    },
    updateGame(state, action: PayloadAction<IGame>) {
      const index = state.games.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.games[index] = action.payload;
      }
    },
    setUpcomingGames(state, action: PayloadAction<IGame[]>) {
      state.upcomingGames = action.payload;
    },
    addUpcomingGame(state, action: PayloadAction<IGame>) {
      state.upcomingGames.push(action.payload);
    },
    removeUpcomingGame(state, action: PayloadAction<number>) {
      state.upcomingGames = state.upcomingGames.filter(
        (game) => game.id !== action.payload
      );
    },
  },
});

export const {
  setGames,
  addGame,
  removeGame,
  updateGame,
  setUpcomingGames,
  addUpcomingGame,
  removeUpcomingGame,
} = gameSlice.actions;

export default gameSlice.reducer;

export const fetchGames = createAsyncThunk("games/fetchGames", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/games");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch games");
  }
});

export const startGame = createAsyncThunk("games/startGame", async (gameId: string, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(`/games/${gameId}/start`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to start game");
  }
});
