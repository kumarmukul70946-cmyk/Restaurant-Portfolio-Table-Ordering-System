const ITEM_ARTWORK = {
  'soup of the day': '/menu-art/soup-of-the-day.svg',
  bruschetta: '/menu-art/bruschetta.svg',
  'grilled chicken': '/menu-art/grilled-chicken.svg',
  'vegetable pasta': '/menu-art/vegetable-pasta.svg',
  'chocolate brownie': '/menu-art/chocolate-brownie.svg',
  'fresh lime soda': '/menu-art/fresh-lime-soda.svg',
  'french fries': '/menu-art/french-fries.svg',
};

const CATEGORY_ARTWORK = {
  starters: '/menu-art/bruschetta.svg',
  mains: '/menu-art/grilled-chicken.svg',
  desserts: '/menu-art/chocolate-brownie.svg',
  drinks: '/menu-art/fresh-lime-soda.svg',
  sides: '/menu-art/french-fries.svg',
};

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function getMenuImageUrl(item = {}) {
  if (item.image?.url) return item.image.url;

  const itemMatch = ITEM_ARTWORK[normalize(item.name)];
  if (itemMatch) return itemMatch;

  const categoryMatch = CATEGORY_ARTWORK[normalize(item.category)];
  if (categoryMatch) return categoryMatch;

  return '/menu-art/chef-signature.svg';
}
