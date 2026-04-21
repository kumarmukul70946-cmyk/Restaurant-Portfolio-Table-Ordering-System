import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useTable } from '../context/TableContext';
import styles from './RestaurantSelect.module.css';

export default function RestaurantSelect() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentRestaurant, setRestaurant } = useRestaurant();
  const { clearTable } = useTable();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get('/restaurants?active=true')
      .then((res) => setRestaurants(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load restaurants.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (restaurant) => {
    setRestaurant(restaurant);
    clearTable();
    clearCart();
    navigate('/tables');
  };

  if (loading) return <div className={styles.center}>Loading restaurants...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Choose your branch</p>
        <h1>Select a restaurant before choosing your table and food</h1>
        <p className={styles.copy}>
          Pick the restaurant you want to book, then continue to its table layout and menu.
        </p>
      </div>

      <div className={styles.grid}>
        {restaurants.map((restaurant) => {
          const active = currentRestaurant?._id === restaurant._id;
          return (
            <article key={restaurant._id} className={`${styles.card} ${active ? styles.activeCard : ''}`}>
              <div className={styles.imageWrap}>
                <img src={restaurant.image?.url || '/restaurant-art/restaurant-default.svg'} alt={restaurant.name} className={styles.image} />
              </div>
              <div className={styles.body}>
                <div className={styles.topRow}>
                  <div>
                    <h2>{restaurant.name}</h2>
                    <p className={styles.location}>{restaurant.location}</p>
                  </div>
                  <span className={styles.code}>{restaurant.code}</span>
                </div>
                {restaurant.tagline && <p className={styles.tagline}>{restaurant.tagline}</p>}
                <div className={styles.meta}>
                  <span>{restaurant.availableTables} available tables</span>
                  <span>{restaurant.totalTables} total tables</span>
                </div>
                {restaurant.cuisineTags?.length > 0 && (
                  <div className={styles.tags}>
                    {restaurant.cuisineTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <button type="button" className={styles.selectBtn} onClick={() => handleSelect(restaurant)}>
                  {active ? 'Continue with this restaurant' : 'Choose this restaurant'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {restaurants.length === 0 && (
        <p className={styles.empty}>No restaurants available yet. Add them in Admin.</p>
      )}
    </div>
  );
}
