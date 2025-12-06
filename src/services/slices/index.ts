export { default as ingredientsReducer } from './ingredientsSlice';
export { default as constructorReducer } from './constructorSlice';
export { default as orderReducer } from './orderSlice';
export { default as feedReducer } from './feedSlice';
export { default as ordersReducer } from './ordersSlice';
export { default as userReducer } from './userSlice';

export { fetchIngredients } from './ingredientsSlice';

export {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';

export { createOrder, clearOrder } from './orderSlice';

export { fetchFeeds, setFeeds } from './feedSlice';

export { fetchOrders, fetchOrderByNumber, setOrders } from './ordersSlice';

export {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  setAuthChecked
} from './userSlice';
