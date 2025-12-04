import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { clearConstructor } from './constructorSlice';
import type { AppDispatch, RootState } from '../store';

export interface OrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { dispatch: AppDispatch; state: RootState }
>('order/createOrder', async (ingredients, { dispatch }) => {
  const data = await orderBurgerApi(ingredients);
  dispatch(clearConstructor());
  return data.order;
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
