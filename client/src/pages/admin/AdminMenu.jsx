import { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './AdminMenu.module.css';
import { getMenuImageUrl } from '../../utils/menuArtwork';

const CATEGORIES = ['starters', 'mains', 'desserts', 'drinks', 'sides'];

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'mains',
    available: true,
    specialOfTheDay: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchMenu = () => {
    api.get('/menu').then((res) => setItems(res.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setShowCreateForm(true);
    setForm({
      name: '',
      description: '',
      price: '',
      category: 'mains',
      available: true,
      specialOfTheDay: false,
    });
    setImageFile(null);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      available: item.available,
      specialOfTheDay: item.specialOfTheDay || false,
    });
    setImageFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    fd.append('available', form.available);
    fd.append('specialOfTheDay', form.specialOfTheDay);
    if (imageFile) fd.append('image', imageFile);

    const req = editing
      ? api.put(`/menu/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/menu', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

    req
      .then(() => {
        fetchMenu();
        setEditing(null);
        setShowCreateForm(false);
        setForm({ name: '', description: '', price: '', category: 'mains', available: true, specialOfTheDay: false });
        setImageFile(null);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this item?')) return;
    api.delete(`/menu/${id}`).then(() => fetchMenu());
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Menu management</h1>
        <button type="button" onClick={openCreate} className={styles.addBtn}>
          Add item
        </button>
      </div>

      {(editing || showCreateForm) && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
            />
            Available
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.specialOfTheDay}
              onChange={(e) => setForm((f) => ({ ...f, specialOfTheDay: e.target.checked }))}
            />
            Special of the day
          </label>
          <label className={styles.fileLabel}>
            Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </label>
          <div className={styles.formActions}>
            <button type="button" onClick={() => { setEditing(null); setShowCreateForm(false); setForm({ name: '', description: '', price: '', category: 'mains', available: true, specialOfTheDay: false }); }}>Cancel</button>
            <button type="submit" disabled={submitting}>
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item._id} className={styles.card}>
              <img src={getMenuImageUrl(item)} alt={item.name} className={styles.img} loading="lazy" />
              <div className={styles.body}>
                <h3>{item.name}</h3>
                <p className={styles.meta}>₹{item.price} · {item.category}</p>
                <div className={styles.actions}>
                  <button type="button" onClick={() => openEdit(item)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(item._id)} className={styles.del}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
