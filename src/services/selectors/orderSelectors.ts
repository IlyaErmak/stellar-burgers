import { RootState } from '../store';

export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
