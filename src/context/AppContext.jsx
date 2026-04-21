import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultMenu = [
  { id: 1, name: 'Truffle Fries', category: 'Starters', price: 8.99, image: 'https://images.unsplash.com/photo-1576107232684-1279f39085d2?auto=format&fit=crop&q=80&w=400', description: 'Crispy fries tossed in white truffle oil and parmesan.', special: false, enabled: true },
  { id: 2, name: 'Sizzling Fajitas', category: 'Main Course', price: 18.99, image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=400', description: 'Grilled steak with bell peppers and onions, served with tortillas.', special: true, enabled: true },
  { id: 3, name: 'Creamy Mushroom Pasta', category: 'Main Course', price: 15.50, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400', description: 'Penne pasta in a rich garlic and wild mushroom cream sauce.', special: false, enabled: true },
  { id: 4, name: 'Lava Cake', category: 'Desserts', price: 7.50, image: 'https://images.unsplash.com/photo-1624353365286-cb18d415f013?auto=format&fit=crop&q=80&w=400', description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.', special: false, enabled: true },
  { id: 5, name: 'Mojito Pitcher', category: 'Drinks', price: 24.00, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=400', description: 'Classic refreshing mojito with fresh mint and lime, perfect for sharing.', special: false, enabled: true },
];

export const AppProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('menuData');
    if (saved) return JSON.parse(saved);
    return defaultMenu;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orderData');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('menuData', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('orderData', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders([{...order, id: Date.now(), status: 'Pending', time: new Date().toISOString()}, ...orders]);
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const addMenuItem = (newItem) => {
    setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
  };
  
  const deleteMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const updateOrderStatus = (id, status) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
  };

  return (
    <AppContext.Provider value={{ 
      menuItems, setMenuItems, 
      orders, addOrder, updateOrderStatus,
      addMenuItem, updateMenuItem, deleteMenuItem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
