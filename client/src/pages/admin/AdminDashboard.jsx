import { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    popularItems: [],
    pendingOrders: 0,
    menuCount: 0,
    restaurantCount: 0,
    totalTables: 0,
    availableTables: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchAnalytics = () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    Promise.all([
      api.get(`/orders/admin/analytics?${params}`),
      api.get('/orders/admin/all'),
      api.get('/restaurants'),
      api.get('/tables'),
      api.get('/menu'),
    ])
      .then(([analyticsRes, ordersRes, restaurantsRes, tablesRes, menuRes]) => {
        const analytics = analyticsRes.data.data || {};
        const orders = ordersRes.data.data || [];
        const restaurants = restaurantsRes.data.data || [];
        const tables = tablesRes.data.data || [];
        const menuItems = menuRes.data.data || [];

        setStats({
          totalOrders: analytics.totalOrders || 0,
          totalRevenue: analytics.totalRevenue || 0,
          popularItems: analytics.popularItems || [],
          pendingOrders: orders.filter((order) =>
            ['pending', 'confirmed', 'preparing'].includes(order.status)
          ).length,
          menuCount: menuItems.length,
          restaurantCount: restaurants.length,
          totalTables: tables.length,
          availableTables: tables.filter((table) => table.status === 'available').length,
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div className={styles.loading}>Loading analytics...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>Track orders, menu coverage, and table availability from one place.</p>
        </div>
      </div>
      <div className={styles.filters}>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button type="button" onClick={fetchAnalytics}>
          Apply
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.label}>Total orders</span>
          <span className={styles.value}>{stats.totalOrders}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Revenue</span>
          <span className={styles.value}>₹{Number(stats.totalRevenue || 0).toFixed(2)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Active kitchen queue</span>
          <span className={styles.value}>{stats.pendingOrders}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Menu items</span>
          <span className={styles.value}>{stats.menuCount}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Restaurants</span>
          <span className={styles.value}>{stats.restaurantCount}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Tables configured</span>
          <span className={styles.value}>{stats.totalTables}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>Tables available</span>
          <span className={styles.value}>{stats.availableTables}</span>
        </div>
      </div>
      <section className={styles.section}>
        <h2>Popular items</h2>
        {stats.popularItems?.length > 0 ? (
          <ul className={styles.list}>
            {stats.popularItems.map((item, i) => (
              <li key={i}>
                <span>{item.name}</span>
                <span>{item.quantity} sold</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No order data in this period.</p>
        )}
      </section>
    </div>
  );
}
