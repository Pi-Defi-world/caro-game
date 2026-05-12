import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/games";
import authReducer from "./slices/auth"
import notificationReducer from "./slices/notifcations"
import gameHistoryReducer from "./slices/gameHistory";
import petsReducer from "./slices/pets";
import charactersReducer from "./slices/characters";
import vipReducer from "./slices/vip"
import friendReducer from "./slices/friends"
import roomReducer from "./slices/room"
import recordReducer from "./slices/record"
import adsReducer from "./slices/ads"
import taskReducer from "./slices/tasks";
import messageReducer from "./slices/message";


export const store = configureStore({
  reducer: {
    game: gameReducer,
    auth:authReducer,
    notifications:notificationReducer,
    gameHistories:gameHistoryReducer,
    pets:petsReducer,
    characters:charactersReducer,
    vips:vipReducer,
    rooms:roomReducer,
    friends:friendReducer,
    records: recordReducer,
    ads:adsReducer,
    tasks:taskReducer,
    messages:messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;
