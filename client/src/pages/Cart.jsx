import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTable } from '../context/TableContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const { currentTable } = useTable();
  const { items, updateQuantity, removeItem, subtotal, tax, total } = useCart();

  if (!currentTable || currentTable._id !== tableId) {
    navigate('/tables', { replace: true });
    return null;
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Your cart is empty.</p>
        <Link to={`/table/${tableId}/menu`} className={styles.link}>
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <span className={styles.branchBadge}>{currentRestaurant?.name}</span>
      <h1 className={styles.title}>Your order</h1>
      <ul className={styles.list}>
        {items.map((i) => (
          <li key={i.menuItem} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.name}>{i.name}</span>
              <span className={styles.price}>₹{i.price.toFixed(2)} each</span>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => updateQuantity(i.menuItem, i.quantity - 1)}
                aria-label="Decrease"
              >
                −
              </button>
              <span className={styles.qty}>{i.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(i.menuItem, i.quantity + 1)}
                aria-label="Increase"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(i.menuItem)}
                className={styles.remove}
                aria-label="Remove"
              >
                Remove
              </button>
            </div>
            <span className={styles.lineTotal}>
              ₹{(i.price * i.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.summary}>
        <div className={styles.line}>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.line}>
          <span>Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className={styles.lineTotal}>
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      <div className={styles.actionsBottom}>
        <Link to={`/table/${tableId}/menu`} className={styles.secondary}>
          Back to menu
        </Link>
        <Link to={`/table/${tableId}/order-confirm`} className={styles.primary}>
          Place order
        </Link>
      </div>
    </div>
  );
}
