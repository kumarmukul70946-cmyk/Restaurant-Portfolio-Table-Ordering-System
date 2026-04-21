import { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './AdminOrders.module.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    setError('');
    api
      .get('/orders/admin/all')
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = (orderId, status) => {
    setError('');
    api
      .patch(`/orders/admin/${orderId}/status`, { status })
      .then((res) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.data : o))
        );
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to update order status.'));
  };

  if (loading) return <p className={styles.loading}>Loading orders...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p className={styles.subtitle}>Review customer details, table numbers, and live kitchen status updates.</p>
        </div>
        <button type="button" onClick={fetchOrders} className={styles.refreshBtn}>
          Refresh
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order._id} className={styles.card}>
            <div className={styles.head}>
              <span>#{order._id.slice(-8)}</span>
              <span>{order.restaurantName || 'Restaurant not assigned'}</span>
              <span>Table {order.tableNumber}</span>
              <span className={styles.date}>
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className={styles.customer}>
              <strong>{order.customerName || 'Guest customer'}</strong>
              <span>{order.customerPhone || 'No phone'}</span>
              {order.customerEmail && <span>{order.customerEmail}</span>}
            </div>
            <ul className={styles.items}>
              {order.items?.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} — ₹
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            {order.notes && <p className={styles.notes}>Notes: {order.notes}</p>}
            <div className={styles.footer}>
              <strong>Total: ₹{order.total?.toFixed(2)}</strong>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className={styles.select}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && (
        <p className={styles.empty}>No orders yet.</p>
      )}
    </div>
  );
}
