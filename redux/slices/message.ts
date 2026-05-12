import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";
import { updateUserRole } from "./auth";

interface IMessage {
  _id: string;
  message: string;
  chat: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
export interface IChat {
  _id: string;
  name: string;
  moderators: string[];
  hasModerator: boolean;
  country: string;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
}

interface MessageState {
  messages: IMessage[];
  chats: IChat[];
  loading: boolean;
  error: string | null;
}



const initialState: MessageState = {
  messages: [],
  chats: [],
  loading: false,
  error: null
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/messages");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchChats = createAsyncThunk(
  "messages/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/chats");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const applyForModerator = createAsyncThunk(
  "messages/applyForModerator",
  async (chatId: string, { rejectWithValue,dispatch }) => {
    try {
      const response = await axiosClient.put(`/chats/${chatId}/moderator-apply`);
      dispatch(updateUserRole("moderator"));
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setChatModerator: (state, action: PayloadAction<{ chatId: string; hasModerator: boolean }>) => {
      const { chatId, hasModerator } = action.payload;
      const chat = state.chats.find(c => c._id === chatId);
      if (chat) {
        chat.hasModerator = hasModerator;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<IMessage[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })

      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<IChat[]>) => {
        state.loading = false;
        state.chats = action.payload;
      }
      )
      .addCase(applyForModerator.fulfilled, (state, action: PayloadAction<string>) => {
        const chatId = action.payload;
        const chat = state.chats.find(c => c._id === chatId);
        if (chat) {
          chat.hasModerator = true; 
        }
      }
      )
  }
});

export const { setChatModerator } = messageSlice.actions;

export default messageSlice.reducer;

