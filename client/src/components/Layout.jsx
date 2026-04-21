import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTable } from '../context/TableContext';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { useRestaurant } from '../context/RestaurantContext';
import styles from './Layout.module.css';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTable, clearTable } = useTable();
  const { itemCount, clearCart } = useCart();
  const { customer, isAuthenticated, clearCustomer } = useCustomer();
  const { currentRestaurant, clearRestaurant } = useRestaurant();
  const customerInitials = (customer?.name || 'Guest')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const branchLocation = currentRestaurant?.location?.split(',')[0] || 'Dining branch';

  const handleLogout = () => {
    clearCart();
    clearTable();
    clearRestaurant();
    clearCustomer();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;
  const adminLinkClass = `${styles.navLink} ${location.pathname.startsWith('/admin') ? styles.navLinkActive : ''}`;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.brandColumn}>
          <Link to={isAuthenticated ? '/restaurants' : '/login'} className={styles.logo}>
            <span className={styles.logoMark}>R</span>
            <span className={styles.logoText}>
              <span className={styles.logoEyebrow}>Signature dining concierge</span>
              <span className={styles.logoName}>Restaurant</span>
            </span>
          </Link>
          <p className={styles.brandNote}>
            Select a branch, reserve a table, and order in one premium flow.
          </p>
        </div>

        <div className={styles.headerBody}>
          <nav className={styles.nav}>
            {isAuthenticated ? (
              <>
                <NavLink to="/restaurants" className={navLinkClass}>
                  Restaurants
                </NavLink>
                {currentRestaurant && (
                  <NavLink to="/tables" className={navLinkClass}>
                    Tables
                  </NavLink>
                )}
                {currentTable && (
                  <>
                    <NavLink to={`/table/${currentTable._id}/menu`} className={navLinkClass}>
                      Menu
                    </NavLink>
                    <NavLink to={`/table/${currentTable._id}/cart`} className={navLinkClass}>
                      Cart
                      {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                    </NavLink>
                  </>
                )}
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                User Login
              </NavLink>
            )}
            <Link to="/admin/login" className={adminLinkClass}>
              Admin
            </Link>
          </nav>

          {isAuthenticated ? (
            <div className={styles.utilityBar}>
              <div className={`${styles.infoCard} ${styles.infoCardAccent}`}>
                <span className={styles.infoLabel}>Selected Branch</span>
                <strong>{currentRestaurant?.name || 'Choose a restaurant'}</strong>
                <span className={styles.infoMeta}>{branchLocation}</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Table Status</span>
                <strong>{currentTable ? `Table ${currentTable.number}` : 'No table yet'}</strong>
                <span className={styles.infoMeta}>
                  {currentTable ? 'Ready for menu and cart' : 'Pick a table to continue'}
                </span>
              </div>
              <div className={styles.profileCard}>
                <span className={styles.avatar}>{customerInitials}</span>
                <div className={styles.profileText}>
                  <span className={styles.infoLabel}>Guest</span>
                  <strong>{customer?.name}</strong>
                </div>
              </div>
              <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.utilityBar}>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Guest Access</span>
                <strong>Premium table booking</strong>
                <span className={styles.infoMeta}>Continue to login and start ordering</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
