import MenuItem from '../models/MenuItem.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

export const getMenuItems = async (req, res) => {
  try {
    const { category, search, special } = req.query;
    const filter = { available: true };

    if (category) filter.category = category;
    if (search) filter.name = new RegExp(search, 'i');
    if (special === 'true') {
      filter.specialOfTheDay = true;
      filter.specialDate = { $lte: new Date(), $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file?.buffer && process.env.CLOUDINARY_CLOUD_NAME) {
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'menu');
      body.image = { url, publicId };
    }
    const item = await MenuItem.create(body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });

    const body = { ...req.body };
    if (req.file?.buffer && process.env.CLOUDINARY_CLOUD_NAME) {
      if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId);
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'menu');
      body.image = { url, publicId };
    }

    Object.assign(item, body);
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Menu item deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const setSpecialOfTheDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialOfTheDay, specialDate } = req.body;
    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found.' });
    item.specialOfTheDay = !!specialOfTheDay;
    item.specialDate = specialDate ? new Date(specialDate) : null;
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
