import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  ingredientsReducer,
  constructorReducer,
  orderReducer,
  feedReducer,
  ordersReducer,
  userReducer
} from './slices';

const rootReducer = {
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer, // ✅ НОВОЕ ИМЯ
  order: orderReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // ✅ БЕЗ ignoredPaths
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
