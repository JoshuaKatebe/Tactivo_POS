import { useState } from "react";

export default function usePOSCart() {
  const [cart, setCart] = useState([]);

  function add(item) {
    setCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function remove(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function clear() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return { cart, add, remove, clear, total };
}
