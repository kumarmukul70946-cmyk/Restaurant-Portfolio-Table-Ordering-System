import { memo } from 'react';
import styles from './MenuCard.module.css';
import { getMenuImageUrl } from '../utils/menuArtwork';

function MenuCard({ item, onAdd }) {
  const imageUrl = getMenuImageUrl(item);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={item.name} className={styles.img} loading="lazy" />
        {item.specialOfTheDay && (
          <span className={styles.badge}>Special</span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && (
          <p className={styles.desc}>{item.description}</p>
        )}
        <div className={styles.footer}>
          <span className={styles.price}>₹{item.price.toFixed(2)}</span>
          <button type="button" onClick={onAdd} className={styles.addBtn}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(MenuCard);
