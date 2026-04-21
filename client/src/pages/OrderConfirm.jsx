import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useTable } from '../context/TableContext';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import api from '../api/axios';
import styles from './OrderConfirm.module.css';

export default function OrderConfirm() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const { currentTable } = useTable();
  const { items, total, clearCart } = useCart();
  const { customer } = useCustomer();
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  if (!currentTable || currentTable._id !== tableId) {
    navigate('/tables', { replace: true });
    return null;
  }

  if (items.length === 0 && !orderId) {
    navigate(`/table/${tableId}/cart`, { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    api
      .post('/orders', {
        tableId,
        items: items.map((i) => ({ menuItem: i.menuItem, quantity: i.quantity })),
        customerName: customer?.name || undefined,
        customerEmail: customer?.email || undefined,
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      .then((res) => {
        setOrderId(res.data.data._id);
        clearCart();
      })
      .catch((err) => setError(err.response?.data?.message || 'Order failed'))
      .finally(() => setSubmitting(false));
  };

  if (orderId) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <h2>Order placed successfully</h2>
          <p>Order ID: {orderId.slice(-8)}</p>
          <p className={styles.msg}>
            {customerPhone
              ? 'You will receive a confirmation on WhatsApp.'
              : 'Thank you for your order.'}
          </p>
          <Link to={`/table/${tableId}/menu`} className={styles.backBtn}>
            Back to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Confirm order</h1>
      <div className={styles.customerCard}>
        <span className={styles.customerLabel}>Restaurant</span>
        <strong>{currentRestaurant?.name}</strong>
        <p>{currentTable?.number ? `Table ${currentTable.number}` : ''}</p>
      </div>
      <div className={styles.customerCard}>
        <span className={styles.customerLabel}>Ordering as</span>
        <strong>{customer?.name}</strong>
        <p>
          {customer?.phone}
          {customer?.email ? ` · ${customer.email}` : ''}
        </p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          WhatsApp number
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g. 919876543210"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, preferences..."
            className={styles.input}
            rows={2}
          />
        </label>
        <p className={styles.total}>Total: ₹{total.toFixed(2)}</p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <Link to={`/table/${tableId}/cart`} className={styles.cancel}>
            Back to cart
          </Link>
          <button type="submit" disabled={submitting} className={styles.submit}>
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
}
