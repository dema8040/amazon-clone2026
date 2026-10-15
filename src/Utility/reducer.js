import { type } from "./action.type";

export const initialState = {
  basket: [],
  user: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case type.ADD_TO_BASKET: {
      const newItem = action.item;

      if (!newItem || newItem.id == null) {
        console.error("Cannot add product: product ID is missing.", newItem);
        return state;
      }

      const price = Number(newItem.price);

      if (!Number.isFinite(price) || price < 0) {
        console.error("Cannot add product: invalid price.", newItem);
        return state;
      }

      const existingItem = state.basket.find((item) => item.id === newItem.id);

      if (existingItem) {
        const updatedBasket = state.basket.map((item) =>
          item.id === newItem.id
            ? {
                ...item,
                amount: Number(item.amount ?? item.quantity ?? 1) + 1,
                quantity: Number(item.amount ?? item.quantity ?? 1) + 1,
              }
            : item,
        );

        return {
          ...state,
          basket: updatedBasket,
        };
      }

      return {
        ...state,
        basket: [
          ...state.basket,
          {
            ...newItem,
            price,
            amount: 1,
            quantity: 1,
          },
        ],
      };
    }

    case type.REMOVE_FROM_BASKET: {
      const existingItem = state.basket.find((item) => item.id === action.id);

      if (!existingItem) {
        return state;
      }

      const currentQuantity = Number(
        existingItem.amount ?? existingItem.quantity ?? 1,
      );

      if (currentQuantity > 1) {
        return {
          ...state,
          basket: state.basket.map((item) =>
            item.id === action.id
              ? {
                  ...item,
                  amount: currentQuantity - 1,
                  quantity: currentQuantity - 1,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };
    }

    case type.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case type.CLEAR_BASKET:
      return {
        ...state,
        basket: [],
      };

    default:
      return state;
  }
};
