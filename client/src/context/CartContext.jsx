import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('swiggy_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [restaurant, setRestaurant] = useState(() => {
    const saved = localStorage.getItem('swiggy_cart_restaurant');
    return saved ? JSON.parse(saved) : null;
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('swiggy_cart', JSON.stringify(cartItems));
    localStorage.setItem('swiggy_cart_restaurant', JSON.stringify(restaurant));
  }, [cartItems, restaurant]);

  const addItem = (item, restInfo) => {
    // If cart has items from a different restaurant
    if (restaurant && cartItems.length > 0 && restaurant._id !== restInfo._id) {
      setPendingItem({ item, restInfo });
      setConflictModalOpen(true);
      return;
    }

    if (!restaurant || cartItems.length === 0) {
      setRestaurant({
        _id: restInfo._id,
        name: restInfo.name,
        areaName: restInfo.areaName,
        image: restInfo.image
      });
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1, restaurantId: restInfo._id }];
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === itemId);
      if (!existing) return prevItems;
      if (existing.quantity === 1) {
        const remaining = prevItems.filter((i) => i._id !== itemId);
        if (remaining.length === 0) {
          setRestaurant(null);
        }
        return remaining;
      }
      return prevItems.map((i) =>
        i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    setAppliedCoupon(null);
  };

  const resolveConflict = (proceed) => {
    if (proceed && pendingItem) {
      clearCart();
      setRestaurant({
        _id: pendingItem.restInfo._id,
        name: pendingItem.restInfo.name,
        areaName: pendingItem.restInfo.areaName,
        image: pendingItem.restInfo.image
      });
      setCartItems([{ ...pendingItem.item, quantity: 1, restaurantId: pendingItem.restInfo._id }]);
    }
    setPendingItem(null);
    setConflictModalOpen(false);
  };

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'SWIGGY50') {
      setAppliedCoupon({ code: 'SWIGGY50', discount: 50, message: '₹50 flat discount applied!' });
      return { success: true, message: 'Coupon SWIGGY50 applied!' };
    } else if (upper === 'WELCOME100') {
      setAppliedCoupon({ code: 'WELCOME100', discount: 100, message: '₹100 discount applied!' });
      return { success: true, message: 'Coupon WELCOME100 applied!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try SWIGGY50 or WELCOME100' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Bill Calculations
  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 500 ? 0 : 35;
  const platformFee = cartItems.length > 0 ? 6 : 0;
  const gstAndRestaurantCharges = cartItems.length > 0 ? Math.round(itemTotal * 0.05) : 0;
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, itemTotal) : 0;
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = Math.max(0, itemTotal + deliveryFee + platformFee + gstAndRestaurantCharges - discount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurant,
        totalCount,
        itemTotal,
        deliveryFee,
        platformFee,
        gstAndRestaurantCharges,
        discount,
        finalTotal,
        appliedCoupon,
        addItem,
        removeItem,
        getItemQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        conflictModalOpen,
        resolveConflict,
        pendingItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

