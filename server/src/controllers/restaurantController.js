import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';
import { DEFAULT_RESTAURANTS } from '../utils/defaultRestaurants.js';
import { createDefaultTablesForRestaurant } from '../utils/defaultTables.js';

const baseRestaurantFields = 'name code location tagline description cuisineTags image isActive sortOrder';

export const getRestaurants = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === 'true') filter.isActive = true;

    const restaurants = await Restaurant.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const ids = restaurants.map((restaurant) => restaurant._id);
    const tableCounts = await Table.aggregate([
      { $match: { restaurantId: { $in: ids } } },
      { $group: { _id: '$restaurantId', totalTables: { $sum: 1 }, availableTables: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } } } },
    ]);
    const countMap = Object.fromEntries(tableCounts.map((entry) => [entry._id.toString(), entry]));

    res.json({
      success: true,
      data: restaurants.map((restaurant) => ({
        ...restaurant,
        totalTables: countMap[restaurant._id.toString()]?.totalTables || 0,
        availableTables: countMap[restaurant._id.toString()]?.availableTables || 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const availableTables = await Table.countDocuments({ 
      restaurantId: restaurant._id, 
      status: 'available' 
    });

    res.json({ 
      success: true, 
      data: { 
        ...restaurant, 
        availableTables 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      cuisineTags: Array.isArray(req.body.cuisineTags)
        ? req.body.cuisineTags
        : String(req.body.cuisineTags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
    };

    const restaurant = await Restaurant.create(payload);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      cuisineTags: Array.isArray(req.body.cuisineTags)
        ? req.body.cuisineTags
        : String(req.body.cuisineTags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
    };

    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    await Table.deleteMany({ restaurantId: restaurant._id });
    await restaurant.deleteOne();

    res.json({ success: true, message: 'Restaurant and related tables deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateDefaultRestaurants = async (req, res) => {
  try {
    await Restaurant.bulkWrite(
      DEFAULT_RESTAURANTS.map((restaurant) => ({
        updateOne: {
          filter: { code: restaurant.code },
          update: { $set: restaurant },
          upsert: true,
        },
      }))
    );

    const restaurants = await Restaurant.find({ code: { $in: DEFAULT_RESTAURANTS.map((restaurant) => restaurant.code) } })
      .select(baseRestaurantFields)
      .sort({ sortOrder: 1, name: 1 });

    await Table.deleteMany({
      $or: [
        { restaurantId: null },
        { restaurantId: { $exists: false } },
      ],
    });

    const operations = restaurants.flatMap((restaurant) =>
      createDefaultTablesForRestaurant(restaurant).map((table) => ({
        updateOne: {
          filter: { number: table.number },
          update: {
            $set: {
              restaurantId: table.restaurantId,
              capacity: table.capacity,
              section: table.section,
              notes: table.notes,
            },
            $setOnInsert: {
              number: table.number,
              status: table.status,
            },
          },
          upsert: true,
        },
      }))
    );

    const tableResult = await Table.bulkWrite(operations);
    const totalTables = await Table.countDocuments({ restaurantId: { $in: restaurants.map((restaurant) => restaurant._id) } });

    res.json({
      success: true,
      message: 'Default restaurants and tables synced.',
      data: {
        restaurants: restaurants.length,
        tablesCreated: tableResult.upsertedCount,
        tablesUpdated: tableResult.modifiedCount,
        totalTables,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
