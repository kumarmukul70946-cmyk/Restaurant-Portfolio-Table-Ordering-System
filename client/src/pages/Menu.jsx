import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useTable } from '../context/TableContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import MenuCard from '../components/MenuCard';
import styles from './Menu.module.css';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'starters', label: 'Starters' },
  { value: 'mains', label: 'Mains' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'sides', label: 'Sides' },
];

export default function Menu() {
  const { tableId } = useParams();
  const { currentRestaurant } = useRestaurant();
  const { currentTable } = useTable();
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    api
      .get(`/menu?${params}`)
      .then((res) => setItems(res.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  if (!currentTable || currentTable._id !== tableId) {
    return (
      <div className={styles.center}>
        <p>Please select a table first.</p>
        <Link to="/tables">Select table</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.branchBadge}>{currentRestaurant?.name}</span>
        <h1 className={styles.title}>Browse the menu for Table {currentTable.number}</h1>
      </div>
      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value || 'all'} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className={styles.center}>Loading menu...</div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <MenuCard key={item._id} item={item} onAdd={() => addItem(item)} />
          ))}
        </div>
      )}
      {!loading && items.length === 0 && (
        <p className={styles.empty}>No items match your filters.</p>
      )}
      <div className={styles.footer}>
        <Link to={`/table/${tableId}/cart`} className={styles.cartBtn}>
          View cart
        </Link>
      </div>
    </div>
  );
}
