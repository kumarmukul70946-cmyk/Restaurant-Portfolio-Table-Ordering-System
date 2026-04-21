import Table from '../models/Table.js';
import Restaurant from '../models/Restaurant.js';
import { createDefaultTablesForRestaurant, sortTables } from '../utils/defaultTables.js';

export const getTables = async (req, res) => {
  try {
    const filter = {};

    if (req.query.restaurantId) {
      filter.restaurantId = req.query.restaurantId;
    }

    if (req.query.section && req.query.section !== 'all') {
      filter.section = req.query.section;
    }

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const tables = await Table.find(filter).populate('restaurantId', 'name code location image');
    res.json({ success: true, data: sortTables(tables) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('restaurantId', 'name code location image');
    if (!table) return res.status(404).json({ success: false, message: 'Table not found.' });
    res.json({ success: true, data: table });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createTable = async (req, res) => {
  try {
    if (!req.body.restaurantId) {
      return res.status(400).json({ success: false, message: 'Restaurant is required.' });
    }

    const table = await Table.create(req.body);
    const populated = await Table.findById(table._id).populate('restaurantId', 'name code location image');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('restaurantId', 'name code location image');
    if (!table) return res.status(404).json({ success: false, message: 'Table not found.' });
    res.json({ success: true, data: table });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found.' });
    res.json({ success: true, message: 'Table deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateDefaultTables = async (req, res) => {
  try {
    if (!req.body.restaurantId) {
      return res.status(400).json({ success: false, message: 'Restaurant is required to generate tables.' });
    }

    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const layout = createDefaultTablesForRestaurant(restaurant);
    const operations = layout.map((table) => ({
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
    }));

    const result = await Table.bulkWrite(operations);
    const tables = await Table.find({ restaurantId: restaurant._id }).populate('restaurantId', 'name code location image');

    res.json({
      success: true,
      message: `Default ${layout.length}-table layout synced for ${restaurant.name}.`,
      data: {
        created: result.upsertedCount,
        updated: result.modifiedCount,
        total: tables.length,
        tables: sortTables(tables),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
