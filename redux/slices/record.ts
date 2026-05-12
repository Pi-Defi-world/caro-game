import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosClient from "@/lib/axios"
import type { IUser } from "./auth"
import { updateUserBalance } from "./auth"

type TransactionType = "Send" | "Receive" | "Withdraw" | "Deposit" | "Win Game" | "Lose Game" | "Draw Game"
type TabType = "All" | "Wallet transfer" | "Game"

export interface IRecord {
  user: IUser
  type: TransactionType
  amount: number
  status: "success" | "pending" | "failed"
  isPositive: boolean
  category: TabType
  createdAt: Date
  updatedAt: Date
  recipient:string
  trx_hash: string
  _id: string
}

interface FetchRecordsParams {
  page: number
  limit: number
  category?: string
}

interface IRecordState {
  records: IRecord[]
  isLoading: boolean
  error: string | null,
  currentPage: number
  hasMore: boolean
  totalRecords: number
}

const initialState: IRecordState = {
  records: [],
  isLoading: false,
  error: null,
  currentPage: 0,
  hasMore: true,
  totalRecords: 0
}

const PROCESSED_RECORDS_KEY = "processedRecordIds"
const MAX_STORED_RECORDS = 1000 

const getProcessedRecords = (): Set<string> => {
  try {
    const stored = localStorage.getItem(PROCESSED_RECORDS_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch (error) {
    console.error("Error reading processed records from localStorage:", error)
    return new Set()
  }
}

const saveProcessedRecords = (records: Set<string>) => {
  try {
    if (records.size > MAX_STORED_RECORDS) {
      const recordsArray = Array.from(records)
      const recentRecords = recordsArray.slice(-MAX_STORED_RECORDS)
      records = new Set(recentRecords)
    }
    localStorage.setItem(PROCESSED_RECORDS_KEY, JSON.stringify(Array.from(records)))
  } catch (error) {
    console.error("Error saving processed records to localStorage:", error)
  }
}

const hasRecordBeenProcessed = (recordId: string): boolean => {
  const processedRecords = getProcessedRecords()
  return processedRecords.has(recordId)
}

const markRecordAsProcessed = (recordId: string) => {
  const processedRecords = getProcessedRecords()
  processedRecords.add(recordId)
  saveProcessedRecords(processedRecords)
}

export const fetchRecords = createAsyncThunk(
  "records/fetchRecords",
  async ({ page, limit, category }: FetchRecordsParams) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (category) {
      params.append("category", category)
    }

    const response = await axiosClient.get(`/records?${params.toString()}`)
    return {
      records: response.data.records,
      totalRecords: response.data.totalRecords,
      currentPage: page,
      hasMore: response.data.hasMore,
    }
  },
)

export const addRecordAndUpdateBalance = createAsyncThunk(
  "records/addRecordAndUpdateBalance",
  async (record: IRecord, { dispatch, getState }) => {

    if (hasRecordBeenProcessed(record._id)) {
      console.log(`Record ${record._id} has already been processed, skipping balance update`)
      return { record, balanceUpdated: false }
    }

    const state = getState() as { records: IRecordState }
    const recordExistsInState = state.records.records.some((r) => r._id === record._id)

    if (recordExistsInState) {
      // console.log(`Record ${record._id} already exists in state, skipping balance update`)
      return { record, balanceUpdated: false }
    }
    markRecordAsProcessed(record._id)
    dispatch(updateUserBalance(record.amount))

    // console.log(`Processing new record ${record._id}, updating balance by ${record.amount}`)

    return { record, balanceUpdated: true }
  },
)

export const cleanupProcessedRecords = () => {
  const processedRecords = getProcessedRecords()
  if (processedRecords.size > MAX_STORED_RECORDS * 0.8) {
    const recordsArray = Array.from(processedRecords)
    const recentRecords = recordsArray.slice(-MAX_STORED_RECORDS * 0.5)
    saveProcessedRecords(new Set(recentRecords))
    // console.log(`Cleaned up processed records, kept ${recentRecords.length} most recent`)
  }
}

const recordSlice = createSlice({
  name: "records",
  initialState,
  reducers: {

    addRecord: (state, action: PayloadAction<IRecord>) => {
      const recordExists = state.records.some((record) => record._id === action.payload._id)
      if (!recordExists) {
        state.records.push(action.payload)
      }
    },
    clearRecords: (state) => {
      state.records = []
      state.error = null
    },
    resetRecords: (state) => {
      state.records = []
      state.currentPage = 0
      state.hasMore = true
      state.totalRecords = 0
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.isLoading = false

        if (action.payload.currentPage === 1) {
          // First page - replace records
          state.records = action.payload.records
        } else {
          // Subsequent pages - append records
          state.records = [...state.records, ...action.payload.records]
        }

        state.currentPage = action.payload.currentPage
        state.hasMore = action.payload.hasMore
        state.totalRecords = action.payload.totalRecords
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch records"
      })
      // Handle the enhanced thunk action
      .addCase(addRecordAndUpdateBalance.fulfilled, (state, action) => {
        const { record, balanceUpdated } = action.payload
        const recordExists = state.records.some((r) => r._id === record._id)
        if (!recordExists) {
          state.records.push(record)
        }
      })
  },
})

export const { addRecord, clearRecords,resetRecords } = recordSlice.actions
export default recordSlice.reducer
