export const TABLE_SECTIONS = ['Main Hall', 'Window Lounge', 'Patio', 'Private Dining'];

const SECTION_LAYOUTS = [
  {
    section: 'Main Hall',
    startNumber: 1,
    capacities: [2, 2, 4, 4, 4, 4, 6, 6, 4, 4, 2, 2],
    notes: 'Central dining floor with the quickest service access.',
  },
  {
    section: 'Window Lounge',
    startNumber: 13,
    capacities: [2, 2, 4, 4, 4, 2],
    notes: 'Soft lighting and window-side seating for couples and small groups.',
  },
  {
    section: 'Patio',
    startNumber: 19,
    capacities: [2, 2, 4, 4, 6, 6],
    notes: 'Open-air tables suited for relaxed evening service.',
  },
  {
    section: 'Private Dining',
    startNumber: 25,
    capacities: [6, 6, 8, 10],
    notes: 'Larger tables reserved for celebrations and group dining.',
  },
];

export const createDefaultTablesForRestaurant = (restaurant) =>
  SECTION_LAYOUTS.flatMap((layout) =>
    layout.capacities.map((capacity, index) => ({
      restaurantId: restaurant._id,
      number: `${restaurant.code}-${layout.startNumber + index}`,
      capacity,
      section: layout.section,
      notes: layout.notes,
      status: 'available',
    }))
  );

export const DEFAULT_TABLE_LAYOUT = createDefaultTablesForRestaurant({ _id: null, code: 'RST' });

const getRestaurantLabel = (table) =>
  table.restaurantId?.name || table.restaurantName || table.restaurant?.name || '';

const getSectionRank = (section) => {
  const rank = TABLE_SECTIONS.indexOf(section);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
};

const getNumericPart = (value) => {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
};

export const sortTables = (tables) =>
  [...tables].sort((left, right) => {
    const restaurantDiff = getRestaurantLabel(left).localeCompare(getRestaurantLabel(right), undefined, {
      sensitivity: 'base',
    });
    if (restaurantDiff !== 0) return restaurantDiff;

    const sectionDiff = getSectionRank(left.section) - getSectionRank(right.section);
    if (sectionDiff !== 0) return sectionDiff;

    const numericDiff = getNumericPart(left.number) - getNumericPart(right.number);
    if (numericDiff !== 0) return numericDiff;

    return String(left.number).localeCompare(String(right.number), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
