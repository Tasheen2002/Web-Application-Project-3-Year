import { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.product.price * action.payload.quantity)
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.product.price * action.payload.quantity)
        };
      }
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item => {
        if (item.product._id === action.payload.productId) {
          const oldQuantity = item.quantity;
          const newQuantity = action.payload.quantity;
          const quantityDiff = newQuantity - oldQuantity;

          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const item = state.items.find(item => item.product._id === action.payload.productId);
      const quantityDiff = action.payload.quantity - item.quantity;

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (item.product.price * quantityDiff)
      };
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.product._id === action.payload);
      const filteredItems = state.items.filter(item => item.product._id !== action.payload);

      return {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.product.price * itemToRemove.quantity)
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadLocalCart = () => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const cartData = JSON.parse(localCart);
      dispatch({ type: 'SET_CART', payload: cartData });
    }
  };

  const saveLocalCart = (cartData) => {
    localStorage.setItem('cart', JSON.stringify(cartData));
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await cartAPI.addToCart({ productId: product._id, quantity });
        await fetchCart();
      } else {
        dispatch({
          type: 'ADD_ITEM',
          payload: { product, quantity }
        });
        saveLocalCart({
          items: [...state.items, { product, quantity }],
          totalItems: state.totalItems + quantity,
          totalAmount: state.totalAmount + (product.price * quantity)
        });
      }
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      if (isAuthenticated) {
        await cartAPI.updateQuantity({ productId, quantity });
        await fetchCart();
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
        const updatedItems = state.items.map(item =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        saveLocalCart({ items: updatedItems, totalItems, totalAmount });
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        await cartAPI.removeFromCart(productId);
        await fetchCart();
      } else {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
        const updatedItems = state.items.filter(item => item.product._id !== productId);
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        saveLocalCart({ items: updatedItems, totalItems, totalAmount });
      }
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      } else {
        localStorage.removeItem('cart');
      }
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};