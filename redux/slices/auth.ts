import { createSlice, createAsyncThunk, PayloadAction, current } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";
import { onIncompletePaymentFound } from "@/lib/pi";
import { IVIP } from "./vip";

declare global {
  interface Window {
    Pi: any;
  }
}

const scopes = ["username", "payments", "wallet_address"];

export type AuthResult = {
    accessToken: string;
    user: {
      uid: string;
      username: string;
    };
  };

  export type IUser = {
    username: string;
    _id: string;
    deposits: [];
    balance: number;
    flagCount: number;
    GFP:number;
    role:"user" | "admin" | "moderator" | "superadmin" | "developer";
    createdAt: string; 
    uid: string;
    referr: string;
    updatedAt: string; 
    vipLevel: IVIP | null,
    lastCheckIn: string; 
    checkInStreak: number;
    spins:number;
    token: string;
    email: string;
    tempEmail:string,
    emailOtp: string,
    emailOtpExpiry: string; 
    newsletterSubscribed: boolean;
    gameNotificationsEnabled: boolean;
    promotionalNotificationsEnabled: boolean;
};


export interface IReferal {
  username: string;
  points: number;
}

interface IRootState {
  currentUser: IUser | null;
  isInitialized: boolean;
  privileges: {role:string,username:string}[];
  isLoading: boolean;
  isExpired: boolean;
  referrals:IReferal[];
  isSubmittingReferralCode:boolean
}

const initialState: IRootState = {
  currentUser: null,
  privileges: [],
  isInitialized: false,
  isLoading: false,
  isExpired: false,
  referrals:[],
  isSubmittingReferralCode:false
};

export const fetchReferrals = createAsyncThunk(
  "user/fetchReferrals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/users/referrals");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchPriviledges = createAsyncThunk(
  "user/fetchPriiviledges",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/users/privs");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bindEmail = createAsyncThunk(
  "user/bindEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/users/bind-email",
        { email }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to bind email");
    }
  }
);

export const verifyBindEmailOtp = createAsyncThunk(
  "user/verifyBindEmailOtp",
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/users/verify-email",
        { otp }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to bind email");
    }
  }
);

export const subscribeToNewsletter = createAsyncThunk(
  "user/subscribeToNewsletter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch("/users/subscribe-newsletter");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to bind email");
    }
  }
);



export const setupReferralCode = createAsyncThunk(
  "user/setupReferralCode",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/users/set-referr",
        { username }
      );
      return username;
    } catch (error: any) {
      return rejectWithValue(error.response?.status || "Failed to setup referral code");
    }
  }
);



export const authenticateUser = createAsyncThunk(
  "user/authenticateUser", 
  async (_, { rejectWithValue,dispatch }) => {
    try {
      await window.Pi.init({
        version: "2.0",
        sandbox: process.env.NODE_ENV !== "production" ? true : false,
      });
      const authResult: AuthResult = await (window as any).Pi.authenticate(
        scopes,
        onIncompletePaymentFound
      );
      const response = await axiosClient.post("/users/signin", { authResult });
      localStorage.setItem("token", response.data.token);
      dispatch(setToken(response.data.token));
      return response.data;
    } catch (error: any) {
      console.error("Authentication failed:", error);
      return rejectWithValue(error.response?.data || "Authentication failed");
    }
  }
);

export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (authResult: AuthResult) => {
    try {
      console.log("authresult from", authResult);
      const response = await axiosClient.post("/users/signin", { authResult });
      return response.data;
    } catch (error: any) {
      console.log(`error while sign in : ${error}`);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/users/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleExpired = createAsyncThunk(
  "user/expired",
  async (_, { dispatch }) => {
    dispatch(setIsExpired());
    localStorage.removeItem("token");
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/users/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserBalance = createAsyncThunk(
  "user/fetchUserBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/users/balance");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
); 

export const buySpins = createAsyncThunk(
  "user/buySpins",
  async ({ amount }: { amount: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axiosClient.post(
        "/spins/purchase", 
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        spins:response.data.spins,
        gfp:response.data.gfp
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const spinTheWheel = createAsyncThunk(
  "user/spinWheel",
  async ({ amount,prize }: { amount: number,prize:string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axiosClient.post(
        "/spins/", 
        { amount ,prize},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);


const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    removeCurrentUser: (state) => {
      state.currentUser = null;
    },
    updateUserBalance: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.balance += action.payload;
      }
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setIsExpired: (state) => {
      state.isLoading = false;
    },
    flagUser: (state) => {
      if (state.currentUser) {
        state.currentUser.flagCount += 1;
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem("token", action.payload);
      if (state.currentUser) {
        state.currentUser.token = action.payload;
      }
    },
  updateBalance: (state, action) => {
  if (state.currentUser) {
    state.currentUser.balance += action.payload;
  }
    },
      updateGFPBalance: (state, action) => {
      if (state.currentUser) {
        state.currentUser.GFP += action.payload;
      }
    },
    updateVipLevel: (state, action) => {
      if (state.currentUser) {
        state.currentUser.vipLevel = action.payload;
      }
    },
    updateCheckinDate: (state, action) => {
      if (state.currentUser) {
        state.currentUser.lastCheckIn = action.payload;
      }
    },
    updateUserSpin: (state, action) => {
      if (state.currentUser) {
        state.currentUser.spins += action.payload;
      }
    },
    updateUserRole: (
      state,
      action: PayloadAction<"user" | "admin" | "superadmin" | "developer" | "moderator">
    ) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.currentUser;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        console.log("Sign-in failed:", action.payload);
      })
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        console.log("get user info failed:", action.payload);
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(handleExpired.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(handleExpired.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(handleExpired.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchReferrals.pending, (state) => {
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.referrals = action.payload;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        console.log("Fetch referrals failed:", action.payload);
      })
      .addCase(setupReferralCode.pending, (state) => {
        state.isSubmittingReferralCode = true;
      })
      .addCase(setupReferralCode.fulfilled, (state, action) => {
        state.isSubmittingReferralCode = false;
        if (state.currentUser) {
          state.currentUser.referr =action.payload
        }
      })
      .addCase(setupReferralCode.rejected, (state, action) => {
        state.isSubmittingReferralCode = false;
      })
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.balance = action.payload
        }
      })
      .addCase(buySpins.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.spins = action.payload.spins
          state.currentUser.GFP = action.payload.gfp
        }
      })
      .addCase(bindEmail.fulfilled, (state, action) => {
        // console.log("Bind email fulfilled:", action.payload);
      })
      .addCase(verifyBindEmailOtp.fulfilled, (state, action) => {
  
        if (state.currentUser) {
          state.currentUser.email = action.payload.email;
        }
        
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.newsletterSubscribed = action.payload.newsletterSubscribed;
        }
      })
      .addCase(fetchPriviledges.fulfilled, (state, action) => {
        state.privileges = action.payload
      })

  },
});

export const {
  setCurrentUser,
  setToken,
  setIsInitialized,
  setIsExpired,
  updateUserBalance,
  removeCurrentUser,
  updateBalance,
  updateGFPBalance,
  updateVipLevel,
  updateCheckinDate,
  updateUserSpin,
  flagUser,
  updateUserRole
} = authSlice.actions;

export default authSlice.reducer;
