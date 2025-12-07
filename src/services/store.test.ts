import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при вызове с undefined состоянием', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      orders: {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      }
    });
  });

  it('должен вернуть то же состояние при обработке неизвестного экшена', () => {
    const initialState = {
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      orders: {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      }
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(initialState, action);

    expect(state).toEqual(initialState);
  });
});

