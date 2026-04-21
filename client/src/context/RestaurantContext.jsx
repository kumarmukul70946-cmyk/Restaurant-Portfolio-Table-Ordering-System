import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'restaurantSelectedBranch';
const RestaurantContext = createContext(null);

function readStoredRestaurant() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function RestaurantProvider({ children }) {
  const [currentRestaurant, setCurrentRestaurant] = useState(() => readStoredRestaurant());

  useEffect(() => {
    if (currentRestaurant) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRestaurant));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [currentRestaurant]);

  const setRestaurant = (restaurant) => {
    setCurrentRestaurant(restaurant);
  };

  const clearRestaurant = () => {
    setCurrentRestaurant(null);
  };

  return (
    <RestaurantContext.Provider value={{ currentRestaurant, setRestaurant, clearRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
}
