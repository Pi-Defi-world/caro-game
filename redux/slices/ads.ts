import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosClient from "@/lib/axios"

export type AdStatus = "running" | "pending" | "rejected" | "finished"

interface Ad {
  _id: number
  status: AdStatus
  description: string
  details: string
  createdAt: string
  updatedAt: string
}

interface InstantMessage {
  message: string
  advertiser: string
}

interface AdsState {
  ads: Ad[]
  loading: boolean
  error: string | null
  instantMessage: InstantMessage | null
}

const initialState: AdsState = {
  ads: [],
  loading: false,
  error: null,
  instantMessage: null,
}

export const fetchMyAds = createAsyncThunk("ads/fetchMyAds", async () => {
  const response = await axiosClient.get("/ads/my-ads")
  return response.data
})

export const createAd = createAsyncThunk("ads/createAd", async (adData: { description: string }) => {
  const response = await axiosClient.post(
    "/ads",
    { description: adData.description }
  )
  return response.data
})

export const cancelAd = createAsyncThunk("ads/cancelAd", async (adId: number) => {
  const token = localStorage.getItem("token")
  const response = await axiosClient.put(
    `/ads/${adId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return adId
})

export const reapplyAd = createAsyncThunk("ads/reapplyAd", async (adId: number) => {
  const token = localStorage.getItem("token")
  const response = await axiosClient.put(
    `/ads/${adId}/reapply`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return adId
})

export const deleteAdAsync = createAsyncThunk("ads/deleteAd", async (adId: number) => {
  const token = localStorage.getItem("token")
  await axiosClient.delete(`/ads/${adId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return adId
})

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addAd: (state, action: PayloadAction<Omit<Ad, "_id" | "createdAt" | "updatedAt">>) => {
      const newId = Math.max(...state.ads.map((ad) => ad._id)) + 1
      const now = new Date().toISOString()
      state.ads.push({
        ...action.payload,
        _id: newId,
        createdAt: now,
        updatedAt: now,
      })
    },
    updateAdStatus: (state, action: PayloadAction<{ _id: number; status: AdStatus }>) => {
      const ad = state.ads.find((ad) => ad._id === action.payload._id)
      if (ad) {
        ad.status = action.payload.status
        ad.updatedAt = new Date().toISOString()
      }
    },
    deleteAd: (state, action: PayloadAction<number>) => {
      state.ads = state.ads.filter((ad) => ad._id !== action.payload)
    },
    setInstantMessage: (state, action: PayloadAction<InstantMessage>) => {
      state.instantMessage = action.payload
    },
    clearInstantMessage: (state) => {
      state.instantMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAds.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyAds.fulfilled, (state, action) => {
        state.loading = false
        state.ads = action.payload
      })
      .addCase(fetchMyAds.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch ads"
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.ads.push(action.payload)
      })
      .addCase(cancelAd.fulfilled, (state, action) => {
        const ad = state.ads.find((ad) => ad._id === action.payload)
        if (ad) {
          ad.status = "rejected"
          ad.updatedAt = new Date().toISOString()
        }
      })
      .addCase(reapplyAd.fulfilled, (state, action) => {
        const ad = state.ads.find((ad) => ad._id === action.payload)
        if (ad) {
          ad.status = "pending"
          ad.updatedAt = new Date().toISOString()
        }
      })
      .addCase(deleteAdAsync.fulfilled, (state, action) => {
        state.ads = state.ads.filter((ad) => ad._id !== action.payload)
      })
  },
})

export const { setLoading, setError, addAd, updateAdStatus, deleteAd, setInstantMessage, clearInstantMessage } =
  adsSlice.actions

export default adsSlice.reducer

