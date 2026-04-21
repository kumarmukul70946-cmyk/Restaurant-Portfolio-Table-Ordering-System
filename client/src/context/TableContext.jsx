import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const TableContext = createContext(null);
const STORAGE_KEY = 'restaurantSelectedTable';

function readStoredTable() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function TableProvider({ children }) {
  const [currentTable, setCurrentTable] = useState(() => readStoredTable());

  useEffect(() => {
    if (currentTable) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTable));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [currentTable]);

  const setTable = useCallback((table) => {
    setCurrentTable(table);
  }, []);

  const clearTable = useCallback(() => {
    setCurrentTable(null);
  }, []);

  return (
    <TableContext.Provider value={{ currentTable, setTable, clearTable }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within TableProvider');
  return ctx;
}
