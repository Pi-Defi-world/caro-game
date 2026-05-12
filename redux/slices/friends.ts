import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export interface IFriend {
  _id: string;
  username: string;
  rank: number;
  status: "online" | "offline" | "in-game";
}

interface IChallengeUser {
  _id: string;
  username: string;
}

export interface IChallenge {
  _id: string;
    challenger: IChallengeUser;
    opponent: IChallengeUser;
    betAmount: number;
    status: "pending" | "accepted" | "rejected"
    gameType: string;
    createdAt: Date,
    isMe: boolean;
    updatedAt: Date,
    __v: number;
}

export interface IFriendRequest {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  recipient: string;
  status: "pending";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ILeaderBoard {
    status: string;
    rank: number;
    _id: string;
    username: string;
    isFriend: boolean;
    friendshipStatus: "accepted" | "rejected" | "pending" | "none",
    wins: number
}


interface FriendsState {
  friends: IFriend[];
  leaderBoards:ILeaderBoard[];
  friendRequests: IFriendRequest[];
  challenges: IChallenge[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  leaderBoards:[],
  friendRequests: [],
  challenges: [],
  isLoading: false,
  error: null
};

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async () => {
    const response = await axiosClient.get("/friends");
    return response.data;
  }
);

export const fetchFriendRequests = createAsyncThunk(
  "friends/fetchFriendRequests", 
  async () => {
    const response = await axiosClient.get("/friends/friend-requests");
    return response.data;
  }
);

export const fethcLeaderBoardUsers = createAsyncThunk(
  "friends/fetchLeaderboardUsers", 
  async () => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get("/friends/leaderboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (requestId: string) => {
    const response = await axiosClient.post("/friends/friend-requests/accept", { requestId });
    return {
      requestId,
      friend: response.data.friend
    };
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (userId: string) => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.post("/friends/friend-requests/request", { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "friends/rejectFriendRequest",
  async (requestId: string) => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.post("/friends/friend-requests/reject", { requestId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return {
        requestId
    };
  }
);

export const challengeFriend = createAsyncThunk(
  "friends/challengeFriend",
  async ({ userId, betAmount }: { userId: string; betAmount: number }) => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.post("/friends/challenges", { userId, betAmount }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const fetchChallenges = createAsyncThunk(
  "friends/fetchChallenges",
  async () => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get("/friends/challenges", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const acceptChallenge = createAsyncThunk(
  "friends/acceptChallenge",
  async (challengeId:string) => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.post("/friends/challenges/accept",{ challengeId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return {
      challengeId
    };
  }
);

export const rejectChallenge = createAsyncThunk(
  "friends/rejectChallenge",
  async (challengeId:string) => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.post("/friends/challenges/reject", { challengeId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return {
      challengeId
    };
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriendRequest: (state, action) => {
      const requestExists = state.friendRequests.some(
        request => request._id === action.payload._id
      );
      if (!requestExists) {
        state.friendRequests.push(action.payload);
      }
    },
    updateFriendRequest: (state, action: PayloadAction<{requestId: string, receiverId: string,friend:IFriend}>) => {
      state.friendRequests = state.friendRequests.filter(
        request => request._id !== action.payload.requestId
      );
      const leaderboardIndex = state.leaderBoards.findIndex(user => user._id === action.payload.receiverId);
      if (leaderboardIndex !== -1) {
        state.leaderBoards[leaderboardIndex] = {
          ...state.leaderBoards[leaderboardIndex],
          friendshipStatus: 'accepted',
          isFriend:true
        };
      }
      state.friends.push(action.payload.friend)
    },
    addChallenge: (state, action) => {
      state.challenges.push(action.payload);
    },
    updateChallenge: (state, action: PayloadAction<{challengeId: string, status: "accepted" | "rejected"}>) => {
      const index = state.challenges.findIndex(challenge => challenge._id === action.payload.challengeId);
      if (index !== -1) {
        if(action.payload.status === "accepted") {
          state.challenges[index].status = "accepted";
          state.challenges[index].isMe = false;
        } else {
          state.challenges.splice(index, 1);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch friends";
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.friendRequests = action.payload;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = state.friendRequests.filter(
          request => request._id !== action.payload.requestId
        );
        state.friends.push(action.payload.friend);
        const index = state.leaderBoards.findIndex(user => user._id === action.payload.friend._id)
        if (index !== -1) {
          state.leaderBoards[index] = {
            ...state.leaderBoards[index],
            friendshipStatus: 'accepted',
            isFriend: true
          }
        }
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = state.friendRequests.filter(
          request => request._id !== action.payload.requestId
        );
      })
      .addCase(challengeFriend.fulfilled, (state, action) => {
        state.challenges.push(action.payload);
      })
      .addCase(fethcLeaderBoardUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fethcLeaderBoardUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderBoards = action.payload;
        state.error = null;
      })
      .addCase(fethcLeaderBoardUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch leaderboard users";
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.challenges =action.payload;
        state.error = null;
      })
      .addCase(rejectChallenge.fulfilled, (state, action) => {
        const index = state.challenges.findIndex(challenge => challenge._id === action.payload.challengeId);
        if (index !== -1) {
          state.challenges.splice(index, 1);
        }
        state.error = null;
      })
      .addCase(acceptChallenge.fulfilled, (state, action) => {
        const index = state.challenges.findIndex(challenge => challenge._id === action.payload.challengeId);
        if (index !== -1) {
          state.challenges[index].status = "accepted";
        }
        state.error = null;
      })
  }
});

export const {addFriendRequest,updateFriendRequest,addChallenge,updateChallenge} = friendsSlice.actions
export default friendsSlice.reducer;
