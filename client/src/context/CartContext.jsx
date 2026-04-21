import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'restaurantCart';

const initialState = { items: [] };

function initCartState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialState;
  } catch {
    return initialState;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.menuItem === action.payload.menuItem
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItem === action.payload.menuItem
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            menuItem: action.payload.menuItem,
            name: action.payload.name,
            price: action.payload.price,
            quantity: action.payload.quantity || 1,
          },
        ],
      };
    }
    case 'UPDATE_QUANTITY': {
      const { menuItem, quantity } = action.payload;
      if (quantity < 1) {
        return { items: state.items.filter((i) => i.menuItem !== menuItem) };
      }
      return {
        items: state.items.map((i) =>
          i.menuItem === menuItem ? { ...i, quantity } : i
        ),
      };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((i) => i.menuItem !== action.payload),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, initCartState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const updateQuantity = useCallback((menuItem, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItem, quantity } });
  }, []);

  const removeItem = useCallback((menuItem) => {
    dispatch({ type: 'REMOVE_ITEM', payload: menuItem });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
