import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'restaurantCustomerSession';
const CustomerContext = createContext(null);

function readStoredCustomer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CustomerProvider({ children }) {
  const [customer, setCustomerState] = useState(() => readStoredCustomer());

  useEffect(() => {
    if (customer) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [customer]);

  const setCustomer = (details) => {
    setCustomerState({
      name: details.name?.trim() || '',
      email: details.email?.trim() || '',
      phone: details.phone?.trim() || '',
    });
  };

  const clearCustomer = () => {
    setCustomerState(null);
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        setCustomer,
        clearCustomer,
        isAuthenticated: Boolean(customer?.name && customer?.phone),
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider');
  return ctx;
}
