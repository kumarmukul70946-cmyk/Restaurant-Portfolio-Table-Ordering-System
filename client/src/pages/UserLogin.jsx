import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import styles from './UserLogin.module.css';

export default function UserLogin() {
  const { customer, isAuthenticated, setCustomer } = useCustomer();
  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/restaurants" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and WhatsApp number are required.');
      return;
    }

    setCustomer(form);
    navigate(location.state?.from || '/restaurants', { replace: true });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Restaurant Ordering</p>
        <h1>Customer login</h1>
        <p className={styles.copy}>
          Sign in once with your name and WhatsApp number, then select your table and place orders without re-entering your details.
        </p>
        <div className={styles.featureList}>
          <span>Fast table selection</span>
          <span>Saved customer details</span>
          <span>Cleaner admin order tracking</span>
        </div>
      </section>

      <div className={styles.card}>
        <h2>Continue to the restaurant</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Full name
            <input
              type="text"
              value={form.name}
              onChange={(event) => {
                setError('');
                setForm((current) => ({ ...current, name: event.target.value }));
              }}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(event) => {
                setError('');
                setForm((current) => ({ ...current, email: event.target.value }));
              }}
              placeholder="Optional"
              autoComplete="email"
            />
          </label>
          <label>
            WhatsApp number
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => {
                setError('');
                setForm((current) => ({ ...current, phone: event.target.value }));
              }}
              placeholder="e.g. 919876543210"
              autoComplete="tel"
              required
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
