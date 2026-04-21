import { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './AdminTables.module.css';

const TABLE_SECTIONS = ['Main Hall', 'Window Lounge', 'Patio', 'Private Dining'];
const TABLE_STATUSES = ['available', 'occupied', 'reserved', 'cleaning'];
const EMPTY_FORM = {
  restaurantId: '',
  number: '',
  capacity: 4,
  section: 'Main Hall',
  status: 'available',
  notes: '',
};

export default function AdminTables() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantError, setRestaurantError] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [syncingLayout, setSyncingLayout] = useState(false);

  const fetchRestaurants = () => {
    setRestaurantError('');
    api
      .get('/restaurants')
      .then((res) => {
        const nextRestaurants = res.data.data || [];
        setRestaurants(nextRestaurants);
        setSelectedRestaurantId((current) => {
          if (current && nextRestaurants.some((restaurant) => restaurant._id === current)) return current;
          return nextRestaurants[0]?._id || '';
        });
        setForm((current) => ({
          ...current,
          restaurantId:
            current.restaurantId && nextRestaurants.some((restaurant) => restaurant._id === current.restaurantId)
              ? current.restaurantId
              : nextRestaurants[0]?._id || '',
        }));
        if (!nextRestaurants.length) {
          setLoading(false);
        }
      })
      .catch((err) => {
        setRestaurantError(err.response?.data?.message || 'Failed to load restaurants.');
        setLoading(false);
      });
  };

  const fetchTables = (restaurantId = selectedRestaurantId) => {
    if (!restaurantId) {
      setTables([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get(`/tables?restaurantId=${restaurantId}`).then((res) => setTables(res.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchTables(selectedRestaurantId);
      setForm((current) => ({ ...current, restaurantId: current.restaurantId || selectedRestaurantId }));
    }
  }, [selectedRestaurantId]);

  const resetForm = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, restaurantId: selectedRestaurantId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      restaurantId: form.restaurantId || selectedRestaurantId,
      capacity: Number(form.capacity) || 4,
    };

    const request = editing
      ? api.put(`/tables/${editing}`, payload)
      : api.post('/tables', payload);

    request
      .then(() => {
        fetchTables(payload.restaurantId);
        resetForm();
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this table?')) return;
    api.delete(`/tables/${id}`).then(() => fetchTables());
  };

  const handleEdit = (table) => {
    const restaurantId = table.restaurantId?._id || table.restaurantId || '';
    setSelectedRestaurantId(restaurantId);
    setEditing(table._id);
    setForm({
      restaurantId,
      number: table.number,
      capacity: table.capacity,
      section: table.section || 'Main Hall',
      status: table.status || 'available',
      notes: table.notes || '',
    });
  };

  const handleGenerateLayout = () => {
    if (!selectedRestaurantId) {
      return;
    }

    const restaurant = restaurants.find((entry) => entry._id === selectedRestaurantId);
    if (!confirm(`Generate the default 28-table layout for ${restaurant?.name || 'this restaurant'}? Existing matching table numbers will be updated.`)) {
      return;
    }

    setSyncingLayout(true);
    api
      .post('/tables/generate-defaults', { restaurantId: selectedRestaurantId })
      .then(() => {
        fetchTables(selectedRestaurantId);
        resetForm();
      })
      .finally(() => setSyncingLayout(false));
  };

  const selectedRestaurant = restaurants.find((restaurant) => restaurant._id === selectedRestaurantId);
  const totalTables = tables.length;
  const availableTables = tables.filter((table) => table.status === 'available').length;
  const busyTables = totalTables - availableTables;
  const sectionSummary = TABLE_SECTIONS.map((section) => ({
    section,
    count: tables.filter((table) => table.section === section).length,
  })).filter((entry) => entry.count > 0);

  if (loading) return <p className={styles.loading}>Loading tables...</p>;
  if (restaurantError) return <p className={styles.loading}>{restaurantError}</p>;
  if (!selectedRestaurantId) return <p className={styles.loading}>Create a restaurant first to manage tables.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Tables</h1>
          <p className={styles.subtitle}>Manage tables for {selectedRestaurant?.name}. Each restaurant keeps its own table layout.</p>
        </div>
        <button type="button" onClick={handleGenerateLayout} className={styles.generateBtn} disabled={syncingLayout}>
          {syncingLayout ? 'Generating...' : 'Generate 28-table layout'}
        </button>
      </div>

      <div className={styles.filterBar}>
        <label className={styles.restaurantSelect}>
          Restaurant
          <select
            value={selectedRestaurantId}
            onChange={(event) => {
              setEditing(null);
              setSelectedRestaurantId(event.target.value);
              setForm((current) => ({ ...EMPTY_FORM, restaurantId: event.target.value }));
            }}
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Total tables</span>
          <strong>{totalTables}</strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Available now</span>
          <strong>{availableTables}</strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>In service</span>
          <strong>{busyTables}</strong>
        </div>
      </div>

      {sectionSummary.length > 0 && (
        <div className={styles.sections}>
          {sectionSummary.map((entry) => (
            <span key={entry.section} className={styles.sectionChip}>
              {entry.section} · {entry.count}
            </span>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <input
            placeholder="Table number"
            value={form.number}
            onChange={(e) => setForm((current) => ({ ...current, number: e.target.value }))}
            required
          />
          <select
            value={form.restaurantId}
            onChange={(e) => setForm((current) => ({ ...current, restaurantId: e.target.value }))}
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm((current) => ({ ...current, capacity: +e.target.value || 4 }))}
          />
          <select
            value={form.section}
            onChange={(e) => setForm((current) => ({ ...current, section: e.target.value }))}
          >
            {TABLE_SECTIONS.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
          >
            {TABLE_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <textarea
          rows={2}
          placeholder="Notes about the table or section"
          value={form.notes}
          onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
        />

        <div className={styles.formActions}>
          <button type="submit" className={styles.primaryBtn} disabled={submitting}>
            {submitting ? 'Saving...' : editing ? 'Save changes' : 'Add table'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className={styles.secondaryBtn}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className={styles.grid}>
        {tables.map((table) => (
          <div key={table._id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.num}>Table {table.number}</span>
              <span className={`${styles.statusBadge} ${styles[table.status]}`}>{table.status}</span>
            </div>
            <span className={styles.restaurantName}>{table.restaurantId?.name || selectedRestaurant?.name}</span>
            <span className={styles.section}>{table.section || 'Main Hall'}</span>
            <span className={styles.cap}>Seats: {table.capacity}</span>
            {table.notes && <p className={styles.notes}>{table.notes}</p>}
            <div className={styles.actions}>
              <button type="button" onClick={() => handleEdit(table)}>Edit</button>
              <button type="button" onClick={() => handleDelete(table._id)} className={styles.del}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
