import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { CustomerProvider } from './context/CustomerContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { TableProvider } from './context/TableContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomerProvider>
        <RestaurantProvider>
          <TableProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </TableProvider>
        </RestaurantProvider>
      </CustomerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
