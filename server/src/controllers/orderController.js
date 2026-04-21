import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';
import { sendOrderWhatsApp, formatOrderForWhatsApp } from '../utils/whatsapp.js';

export const createOrder = async (req, res) => {
  try {
    const { tableId, items, customerName, customerEmail, customerPhone, notes } = req.body;

    const table = await Table.findById(tableId).populate('restaurantId', 'name');
    if (!table) return res.status(404).json({ success: false, message: 'Table not found.' });

    const menuIds = items.map((i) => i.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuIds }, available: true });
    const priceMap = Object.fromEntries(menuItems.map((m) => [m._id.toString(), { name: m.name, price: m.price }]));

    const orderItems = [];
    let subtotal = 0;
    for (const line of items) {
      const info = priceMap[line.menuItem];
      if (!info) return res.status(400).json({ success: false, message: `Invalid or unavailable item: ${line.menuItem}` });
      const qty = Math.max(1, parseInt(line.quantity, 10) || 1);
      orderItems.push({ menuItem: line.menuItem, name: info.name, price: info.price, quantity: qty });
      subtotal += info.price * qty;
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + tax;

    const order = await Order.create({
      restaurantId: table.restaurantId?._id || null,
      restaurantName: table.restaurantId?.name || '',
      tableId,
      tableNumber: table.number,
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      items: orderItems,
      subtotal,
      tax,
      total,
      notes: notes || '',
    });

    if (customerPhone) {
      const summary = formatOrderForWhatsApp(order);
      const result = await sendOrderWhatsApp(customerPhone, summary);
      if (result.success) order.whatsappSent = true;
      await order.save();
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getOrdersByTable = async (req, res) => {
  try {
    const orders = await Order.find({ tableId: req.params.tableId })
      .sort({ createdAt: -1 })
      .populate('items.menuItem', 'name price');
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, from, to, restaurantId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (restaurantId) filter.restaurantId = restaurantId;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('tableId', 'number');
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getOrderAnalytics = async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(new Date().setHours(0, 0, 0, 0));
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const restaurantId = req.query.restaurantId;
    const match = {
      createdAt: { $gte: from, $lte: to },
      status: { $ne: 'cancelled' },
    };
    if (restaurantId) match.restaurantId = restaurantId;

    const [ordersSummary, popularItems] = await Promise.all([
      Order.aggregate([
        { $match: match },
        { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: '$total' } } },
        { $project: { _id: 0 } },
      ]),
      Order.aggregate([
        { $match: match },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' } } },
        { $sort: { quantity: -1 } },
        { $limit: 10 },
        { $project: { name: '$_id', quantity: 1, _id: 0 } },
      ]),
    ]);

    const stats = ordersSummary[0] || { totalOrders: 0, totalRevenue: 0 };
    res.json({ success: true, data: { ...stats, popularItems } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
