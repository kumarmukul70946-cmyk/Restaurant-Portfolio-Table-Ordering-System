import { useEffect, useState } from 'react';
import api from '../../api/axios';
import styles from './AdminRestaurants.module.css';

const EMPTY_FORM = {
  name: '',
  code: '',
  location: '',
  tagline: '',
  description: '',
  cuisineTags: '',
  imageUrl: '',
  isActive: true,
};

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);

  const fetchRestaurants = () => {
    setLoading(true);
    api.get('/restaurants').then((res) => setRestaurants(res.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      code: form.code,
      location: form.location,
      tagline: form.tagline,
      description: form.description,
      cuisineTags: form.cuisineTags,
      isActive: form.isActive,
      image: { url: form.imageUrl },
    };

    const request = editing
      ? api.put(`/restaurants/${editing}`, payload)
      : api.post('/restaurants', payload);

    request
      .then(() => {
        fetchRestaurants();
        resetForm();
      })
      .finally(() => setSubmitting(false));
  };

  const handleEdit = (restaurant) => {
    setEditing(restaurant._id);
    setForm({
      name: restaurant.name || '',
      code: restaurant.code || '',
      location: restaurant.location || '',
      tagline: restaurant.tagline || '',
      description: restaurant.description || '',
      cuisineTags: restaurant.cuisineTags?.join(', ') || '',
      imageUrl: restaurant.image?.url || '',
      isActive: restaurant.isActive !== false,
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this restaurant and all of its tables?')) return;
    api.delete(`/restaurants/${id}`).then(() => fetchRestaurants());
  };

  const handleGenerateDefaults = () => {
    if (!confirm('Generate the sample restaurants and their tables?')) return;

    setSyncingDefaults(true);
    api
      .post('/restaurants/generate-defaults')
      .then(() => {
        fetchRestaurants();
        resetForm();
      })
      .finally(() => setSyncingDefaults(false));
  };

  if (loading) return <p className={styles.loading}>Loading restaurants...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Restaurants</h1>
          <p className={styles.subtitle}>Create restaurant branches first, then assign tables and orders under each branch.</p>
        </div>
        <button type="button" className={styles.generateBtn} onClick={handleGenerateDefaults} disabled={syncingDefaults}>
          {syncingDefaults ? 'Generating...' : 'Generate sample restaurants'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <input
            placeholder="Restaurant name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
          <input
            placeholder="Code"
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
            required
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
          />
          <input
            placeholder="Tagline"
            value={form.tagline}
            onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))}
          />
          <input
            placeholder="Cuisine tags (comma separated)"
            value={form.cuisineTags}
            onChange={(event) => setForm((current) => ({ ...current, cuisineTags: event.target.value }))}
          />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
          />
        </div>
        <textarea
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
          />
          Active branch
        </label>
        <div className={styles.formActions}>
          <button type="submit" className={styles.primaryBtn} disabled={submitting}>
            {submitting ? 'Saving...' : editing ? 'Save restaurant' : 'Add restaurant'}
          </button>
          {editing && (
            <button type="button" className={styles.secondaryBtn} onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className={styles.grid}>
        {restaurants.map((restaurant) => (
          <article key={restaurant._id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={restaurant.image?.url || '/restaurant-art/restaurant-default.svg'} alt={restaurant.name} className={styles.image} />
            </div>
            <div className={styles.body}>
              <div className={styles.cardTop}>
                <div>
                  <h2>{restaurant.name}</h2>
                  <p className={styles.location}>{restaurant.location}</p>
                </div>
                <span className={styles.code}>{restaurant.code}</span>
              </div>
              {restaurant.tagline && <p className={styles.tagline}>{restaurant.tagline}</p>}
              <p className={styles.meta}>
                {restaurant.availableTables || 0} available · {restaurant.totalTables || 0} tables
              </p>
              <div className={styles.actions}>
                <button type="button" onClick={() => handleEdit(restaurant)}>Edit</button>
                <button type="button" onClick={() => handleDelete(restaurant._id)} className={styles.del}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
