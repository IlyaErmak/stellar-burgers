import { RootState } from '../store';
import { TConstructorIngredient } from '@utils-types';

export const selectBun = (state: RootState) =>
  state.burgerConstructor?.bun || null;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor?.ingredients || [];
export const selectConstructorTotal = (state: RootState) => {
  const bun = state.burgerConstructor?.bun || null;
  const ingredients = state.burgerConstructor?.ingredients || [];
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
    0
  );
  return bunPrice + ingredientsPrice;
};
