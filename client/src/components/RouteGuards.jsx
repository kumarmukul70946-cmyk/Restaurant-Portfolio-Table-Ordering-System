import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useRestaurant } from '../context/RestaurantContext';

export function RequireCustomerSession() {
  const { isAuthenticated } = useCustomer();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RedirectIfCustomerSession() {
  const { isAuthenticated } = useCustomer();

  if (isAuthenticated) {
    return <Navigate to="/restaurants" replace />;
  }

  return <Outlet />;
}

export function RequireRestaurantSelection() {
  const { currentRestaurant } = useRestaurant();
  const location = useLocation();

  if (!currentRestaurant?._id) {
    return <Navigate to="/restaurants" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
