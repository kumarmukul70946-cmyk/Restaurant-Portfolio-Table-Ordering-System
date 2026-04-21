import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useTable } from '../context/TableContext';
import api from '../api/axios';
import styles from './TableSelect.module.css';

export default function TableSelect() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('All');
  const { currentRestaurant } = useRestaurant();
  const { setTable } = useTable();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentRestaurant?._id) return;

    setLoading(true);
    setActiveSection('All');
    api
      .get(`/tables?restaurantId=${currentRestaurant._id}`)
      .then((res) => setTables(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load tables'))
      .finally(() => setLoading(false));
  }, [currentRestaurant?._id]);

  const handleSelect = (table) => {
    if (table.status !== 'available') return;
    setTable(table);
    navigate(`/table/${table._id}/menu`);
  };

  const sections = ['All', ...new Set(tables.map((table) => table.section).filter(Boolean))];
  const visibleTables = activeSection === 'All'
    ? tables
    : tables.filter((table) => table.section === activeSection);
  const availableTables = tables.filter((table) => table.status === 'available').length;

  if (loading) return <div className={styles.center}>Loading tables...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Select your table at {currentRestaurant?.name}</h1>
        <p className={styles.subtitle}>
          {currentRestaurant?.location}
          {currentRestaurant?.tagline ? ` · ${currentRestaurant.tagline}` : ''}
        </p>
        <div className={styles.stats}>
          <span>{tables.length} tables</span>
          <span>{availableTables} available</span>
        </div>
      </div>

      <div className={styles.filters}>
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            className={`${styles.filterBtn} ${activeSection === section ? styles.filterActive : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visibleTables.map((table) => (
          <button
            key={table._id}
            className={`${styles.card} ${styles[table.status]} ${table.status !== 'available' ? styles.disabled : ''}`}
            onClick={() => handleSelect(table)}
            disabled={table.status !== 'available'}
          >
            <div className={styles.cardTop}>
              <span className={styles.number}>Table {table.number}</span>
              <span className={`${styles.status} ${styles[table.status]}`}>{table.status}</span>
            </div>
            <span className={styles.section}>{table.section || 'Main Hall'}</span>
            <span className={styles.capacity}>Seats: {table.capacity}</span>
            {table.notes && <span className={styles.note}>{table.notes}</span>}
          </button>
        ))}
      </div>
      {tables.length === 0 && (
        <p className={styles.empty}>No tables configured. Add tables in Admin.</p>
      )}
      {tables.length > 0 && visibleTables.length === 0 && (
        <p className={styles.empty}>No tables match that section yet.</p>
      )}
    </div>
  );
}
