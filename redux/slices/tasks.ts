import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export interface ITask  {
  _id:string;
  description: string;
  reward: number;
  type: "link" | "deposit" | "social" | "game" | "token";
  status: "active" | "inactive";
  completionCriteria?: string[];
  isCompleted: boolean;
  amount: number,
  link: string,
  users: string[]
}

interface TaskState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/tasks");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch tasks");
  }
});

export const completeTask = createAsyncThunk("tasks/completeTask", async (taskId: string, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(`/tasks/${taskId}/complete`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to complete task");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<ITask[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload.task;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default taskSlice.reducer;
