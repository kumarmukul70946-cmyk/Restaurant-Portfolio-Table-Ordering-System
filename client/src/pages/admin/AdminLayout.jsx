import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './Admin.module.css';

export default function AdminLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/admin/login';
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    setAuthChecked(false);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAuthChecked(true);
      setIsAuth(false);
      setAdmin(null);
      return;
    }

    api
      .get('/admin/me')
      .then((res) => {
        setIsAuth(true);
        setAdmin(res.data.admin || null);
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        setIsAuth(false);
        setAdmin(null);
      })
      .finally(() => setAuthChecked(true));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  if (!authChecked) return <div className={styles.loading}>Loading...</div>;
  if (isLogin && isAuth) return <Navigate to="/admin/dashboard" replace />;
  if (!isLogin && !isAuth) return <Navigate to="/admin/login" replace />;

  if (isLogin) {
    return <Outlet />;
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <Link to="/admin/dashboard" className={styles.brand}>
          Admin
        </Link>
        {admin && (
          <div className={styles.profile}>
            <strong>{admin.name}</strong>
            <span>{admin.email}</span>
          </div>
        )}
        <nav className={styles.nav}>
          <Link
            to="/admin/dashboard"
            className={location.pathname === '/admin/dashboard' ? styles.active : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/restaurants"
            className={location.pathname === '/admin/restaurants' ? styles.active : ''}
          >
            Restaurants
          </Link>
          <Link
            to="/admin/menu"
            className={location.pathname === '/admin/menu' ? styles.active : ''}
          >
            Menu
          </Link>
          <Link
            to="/admin/orders"
            className={location.pathname === '/admin/orders' ? styles.active : ''}
          >
            Orders
          </Link>
          <Link
            to="/admin/tables"
            className={location.pathname === '/admin/tables' ? styles.active : ''}
          >
            Tables
          </Link>
        </nav>
        <div className={styles.footer}>
          <Link to="/">← Restaurant</Link>
          <button type="button" onClick={handleLogout} className={styles.logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
