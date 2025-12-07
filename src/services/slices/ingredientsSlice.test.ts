import ingredientsReducer, {
  fetchIngredients,
  IngredientsState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice reducer', () => {
  const initialState: IngredientsState = {
    items: [],
    isLoading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients.pending', () => {
    it('должен установить isLoading в true при начале запроса', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });

    it('должен установить isLoading в true и очистить ошибку', () => {
      const stateWithError: IngredientsState = {
        items: [],
        isLoading: false,
        error: 'Предыдущая ошибка'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен установить isLoading в false и записать данные при успешном запросе', () => {
      const stateWithLoading: IngredientsState = {
        items: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });

    it('должен заменить существующие данные новыми', () => {
      const stateWithData: IngredientsState = {
        items: [mockIngredients[0]],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(stateWithData, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен установить isLoading в false и записать ошибку при неудачном запросе', () => {
      const stateWithLoading: IngredientsState = {
        items: [],
        isLoading: true,
        error: null
      };

      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('должен использовать сообщение по умолчанию, если ошибка не передана', () => {
      const stateWithLoading: IngredientsState = {
        items: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('должен сохранить существующие данные при ошибке', () => {
      const stateWithData: IngredientsState = {
        items: mockIngredients,
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = ingredientsReducer(stateWithData, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBe('Ошибка сети');
    });
  });
});

