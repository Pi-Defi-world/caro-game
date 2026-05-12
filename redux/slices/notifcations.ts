import axiosClient from '@/lib/axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './auth';

export interface INotification {
    message: string;
    user:IUser,
    type: 'user' | 'game' | 'achievement' | 'flag' | 'payment' 
    createdAt: string;
    updatedAt: string;
    isRead:boolean;
    _id:string
}

interface NotificationsState {
  notifications: INotification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

export const fetchNotifications = createAsyncThunk(
  "users/notification", 
  async () => {
    const response = await axiosClient.get("/users/notifications");
    return response.data;
  }
);
export const readNotifications = createAsyncThunk(
  "users/readNotifications", 
  async (notificationIds: string[]) => {
    const token = localStorage.getItem("token");
    await axiosClient.post("/users/notifications", { notificationIds }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return notificationIds;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotification>) => {
      const notificationExists = state.notifications.some(
        notification => notification._id === action.payload._id
      );
      if (!notificationExists) {
        state.notifications.push(action.payload);
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification._id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
    builder.addCase(readNotifications.fulfilled, (state, action) => {
      const readIds = action.payload;
      state.notifications.forEach(notification => {
        if (readIds.includes(notification._id)) {
          notification.isRead = true;
        }
      });
    });
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
