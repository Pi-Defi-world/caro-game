import axiosClient from "@/lib/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./auth";
import { IFriend } from "./friends";

export interface IPlayer {
  _id: string;
  username: string;
  balance: number;
  avatar?: string;
}

export interface IRoom {
  _id: string;
  name: string;
  host: IUser;
  players: IUser[];
  maxPlayers: number;
  status: string;
  betAmount: number;
  hostLevel: number;
  prize: number;
  stage: "intro" | "waiting" | "playing" | "ended" | "paused";
  boardState: Record<string, string>;
  currentTurn: string;
  result: "win" | "loss" | "draw" | null;
  gameHistory: Array<{
    position: string;
    symbol: string;
    playerId: string;
    timestamp: string;
  }>;
  lastMove: {
    position: string;
    symbol: string;
    playerId: string;
    timestamp: string;
  } | null;
  gameStartTime: string | null;
  lastActivity: string;
  winner: string | null;
  isDraw: boolean;
  moveCount: number;
  rewarded: boolean;
  total: number;
}

interface RoomState {
  rooms: IRoom[];
  currentRoom: IRoom | null;
  loading: boolean;
  myGames: IRoom[];
  error: string | null;
  onlinePlayers: IFriend[];
  roomCount:number
}

const initialState: RoomState = {
  rooms: [],
  roomCount:0,
  currentRoom: null,
  loading: false,
  myGames: [],
  error: null,
  onlinePlayers: [],
};

export const getMyGames = createAsyncThunk(
  "rooms/fetchMyGames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/rooms/my-games");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/rooms");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (
    { name, betAmount }: { name: string; betAmount: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.post("/rooms", { name, betAmount });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCurrentRoom = createAsyncThunk(
  'rooms/fetchCurrentRoom',
  async (roomId: string, thunkAPI) => {
    const response = await axiosClient.get(`/rooms/${roomId}`);
    return response.data;
  }
);

export const joinRoom = createAsyncThunk(
  "rooms/joinRoom",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(`/rooms/${roomId}/join`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);

export const leaveRoom = createAsyncThunk(
  "rooms/leaveRoom",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(`/rooms/${roomId}/leave`, {});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const handleGameOver = createAsyncThunk(
  "game/gameOver",
  async ({winner,roomId,isDraw}:{winner:string,roomId:string,isDraw:boolean}, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/game/over`, {
        winner,
        roomId,
        isDraw
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<IRoom>) => {
      state.currentRoom = action.payload;
    },
    removeCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    addRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms.unshift(action.payload);
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter((room) => room._id !== action.payload);
    },
    updateRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms = state.rooms.map((room) =>
        room._id === action.payload._id ? action.payload : room
      );
    },
    addPlayerToRoom: (
      state,
      action: PayloadAction<{ roomId: string; player: IUser }>
    ) => {
      const room = state.rooms.find((r) => r._id === action.payload.roomId);
      if (room) {
        room.players.push(action.payload.player);
      }
    },
    removePlayerFromRoom: (
      state,
      action: PayloadAction<{ roomId: string; playerId: string }>
    ) => {
  

      if (state.currentRoom && state.currentRoom._id === action.payload.roomId) {
        state.currentRoom.players = state.currentRoom.players.filter(
          (p) => p._id !== action.payload.playerId
        );

        if (state.currentRoom.players.length > 0) {
          state.currentRoom.stage = "waiting";
        }
      }
    },
    setOnlinePlayers: (state, action) => {
      state.onlinePlayers = action.payload;
    },
    setRoomCount:(state, action) => {
      state.roomCount = action.payload;
    },
    setMyGames:(state, action) => {
      state.myGames = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(joinRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.unshift(action.payload);
      })
      .addCase(getMyGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyGames.fulfilled, (state, action) => {
        state.loading = false;
        state.myGames = action.payload;
      })
      .addCase(getMyGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(leaveRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(leaveRoom.fulfilled, (state,action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(leaveRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // state.currentRoom = null;
      })
      .addCase(fetchCurrentRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchCurrentRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setRooms,
  setCurrentRoom,
  addRoom,
  removeRoom,
  updateRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  removeCurrentRoom,
  setOnlinePlayers,
  setRoomCount,
  setMyGames
} = roomSlice.actions;

export default roomSlice.reducer;
