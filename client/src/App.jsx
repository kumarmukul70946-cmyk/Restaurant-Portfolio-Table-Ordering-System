import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { RedirectIfCustomerSession, RequireCustomerSession, RequireRestaurantSelection } from './components/RouteGuards';
import RestaurantSelect from './pages/RestaurantSelect';
import TableSelect from './pages/TableSelect';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderConfirm from './pages/OrderConfirm';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminTables from './pages/admin/AdminTables';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route element={<RedirectIfCustomerSession />}>
          <Route path="login" element={<UserLogin />} />
        </Route>
        <Route element={<RequireCustomerSession />}>
          <Route path="restaurants" element={<RestaurantSelect />} />
          <Route element={<RequireRestaurantSelection />}>
            <Route path="tables" element={<TableSelect />} />
            <Route path="table/:tableId/menu" element={<Menu />} />
            <Route path="table/:tableId/cart" element={<Cart />} />
            <Route path="table/:tableId/order-confirm" element={<OrderConfirm />} />
          </Route>
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/login" replace />} />
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="tables" element={<AdminTables />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
