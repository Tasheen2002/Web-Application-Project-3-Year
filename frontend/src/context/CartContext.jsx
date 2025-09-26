import { createContext, useContext, useReducer, useEffect } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CART":
      return {
        ...state,
        items: action.payload?.items || [],
        totalItems: action.payload?.totalItems || 0,
        totalAmount: action.payload?.totalAmount || 0,
        loading: false,
      };
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        (item) => item.product._id === action.payload.product._id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount:
            state.totalAmount +
            action.payload.product.price * action.payload.quantity,
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount:
            state.totalAmount +
            action.payload.product.price * action.payload.quantity,
        };
      }
    case "UPDATE_QUANTITY":
      const itemToUpdate = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (!itemToUpdate) return state;

      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      const updatedItems = state.items.map((item) => {
        if (item.product._id === action.payload.productId) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount:
          state.totalAmount + itemToUpdate.product.price * quantityDiff,
      };
    case "REMOVE_ITEM":
      const itemToRemove = state.items.find(
        (item) => item.product._id === action.payload
      );
      const filteredItems = state.items.filter(
        (item) => item.product._id !== action.payload
      );

      return {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount:
          state.totalAmount -
          itemToRemove.product.price * itemToRemove.quantity,
      };
    case "CLEAR_CART":
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
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartAPI.getCart();
      dispatch({ type: "SET_CART", payload: response.data.cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadLocalCart = () => {
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      const cartData = JSON.parse(localCart);
      dispatch({ type: "SET_CART", payload: cartData });
    }
  };

  const saveLocalCart = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await cartAPI.addToCart({
          productId: product._id,
          quantity,
        });
        await fetchCart();
      } else {
        dispatch({
          type: "ADD_ITEM",
          payload: { product, quantity },
        });

        // Calculate new state for local storage
        const existingItemIndex = state.items.findIndex(
          (item) => item.product._id === product._id
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          updatedItems = [...state.items, { product, quantity }];
        }

        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        saveLocalCart({ items: updatedItems, totalItems, totalAmount });
      }
      toast.success("Added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      if (isAuthenticated) {
        // Find the cart item by productId to get the itemId
        const cartItem = state.items.find(
          (item) => item.product._id === productId
        );
        if (!cartItem) {
          toast.error("Item not found in cart");
          return;
        }

        await cartAPI.updateQuantity(cartItem._id, quantity);
        await fetchCart();
      } else {
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
        const updatedItems = state.items.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        saveLocalCart({ items: updatedItems, totalItems, totalAmount });
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        // Find the cart item by productId to get the itemId
        const cartItem = state.items.find(
          (item) => item.product._id === productId
        );
        if (!cartItem) {
          toast.error("Item not found in cart");
          return;
        }

        await cartAPI.removeFromCart(cartItem._id);
        await fetchCart();
      } else {
        dispatch({ type: "REMOVE_ITEM", payload: productId });
        const updatedItems = state.items.filter(
          (item) => item.product._id !== productId
        );
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        saveLocalCart({ items: updatedItems, totalItems, totalAmount });
      }
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove from cart");
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      } else {
        localStorage.removeItem("cart");
      }
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
