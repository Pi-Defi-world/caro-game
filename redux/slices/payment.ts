
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  onCancel,
  onError,
  onIncompletePaymentFound,
  onReadyForServerApproval,
  onReadyForServerCompletion,
} from "@/lib/pi";
import { fetchUserBalance, fetchUserData, signInUser } from "./auth";
import axiosClient from "@/lib/axios";
import { addRecord } from "./record";

interface IPaymentState {
  isProcessing: boolean;
  error: string | null;
}
export type MyPaymentMetadata = {};
export interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

const initialState: IPaymentState = {
  isProcessing: false,
  error: null,
};

export const deposit = createAsyncThunk(
  "payment/deposit",
  async (
    {
      memo,
      amount,
      paymentMetadata,
    }: { memo: string; amount: number; paymentMetadata: MyPaymentMetadata },
    { dispatch, rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks = {
      onIncompletePaymentFound,
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    };

    try {
      const Pi = (window as any).Pi;

      Pi.init({
        version: "2.0",
        sandbox: process.env.NODE_ENV !== "production" ? true : false,
      })

      await Pi.authenticate(
        ["payments", "username", "wallet_address"],
        onIncompletePaymentFound
      );

      const payment: PaymentDTO = await Pi.createPayment(paymentData, {
        ...callbacks,
        headers: { Authorization: `Bearer ${token}` }
      })

      await dispatch(fetchUserBalance())

      return payment;
    } catch (error: any) {
      console.error("Payment error:", error);
      return rejectWithValue(error.message || "Payment failed");
    }
  }
);

export const withdrawPi = createAsyncThunk(
  "payment/withdrawPi",
  async (
    {
      walletAddress,
      amount,
    }: { walletAddress: string; amount: number; },
    { dispatch, rejectWithValue }
  ) => {
    
    try {
      const res = await axiosClient.post("/payments/withdraw", {
        recipient: walletAddress,
        amount,
      });

      dispatch(addRecord(res.data))
      // alert(res.data.type);

      return res.data;
    } catch (error: any) {
      console.error("Payment error:", error);
      return rejectWithValue(error.message || "Payment failed");
    }
  }
);    

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deposit.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.isProcessing = false;

      })
      .addCase(deposit.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      })
      .addCase(withdrawPi.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(withdrawPi.fulfilled, (state, action) => {
        state.isProcessing = false;
      }
      )
      .addCase(withdrawPi.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      }
      )
  },
});

export default paymentSlice.reducer;
