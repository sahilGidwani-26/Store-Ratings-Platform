const bcrypt = require('bcryptjs');
const { Op, fn, col } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

// Postgres supports case-insensitive ILIKE; MySQL/SQLite fall back to LIKE
const likeOp = sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

// GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/admin/users  -> create user or admin (role passed in body) or store-owner account
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const allowedRoles = ['admin', 'user', 'owner'];
    const finalRole = allowedRoles.includes(role) ? role : 'user';

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role: finalRole });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/admin/stores -> create a store, optionally assign an existing owner user
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner || owner.role !== 'owner') {
        return res.status(400).json({ message: 'ownerId must reference an existing user with role owner' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ store });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [likeOp]: `%${name}%` };
    if (email) where.email = { [likeOp]: `%${email}%` };
    if (address) where.address = { [likeOp]: `%${address}%` };
    if (role) where.role = role;

    const allowedSort = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortOrder]],
      include: [{ model: Store, as: 'ownedStore', attributes: ['id', 'name'] }],
    });

    // For store owners, compute their store's average rating
    const results = await Promise.all(
      users.map(async (u) => {
        const plain = u.toJSON();
        if (u.role === 'owner' && plain.ownedStore) {
          const avg = await Rating.findOne({
            where: { storeId: plain.ownedStore.id },
            attributes: [[fn('AVG', col('rating')), 'avgRating']],
            raw: true,
          });
          plain.rating = avg && avg.avgRating ? parseFloat(avg.avgRating).toFixed(1) : null;
        }
        return plain;
      })
    );

    res.json({ users: results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/users/:id
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'ownedStore' }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const plain = user.toJSON();
    if (user.role === 'owner' && plain.ownedStore) {
      const avg = await Rating.findOne({
        where: { storeId: plain.ownedStore.id },
        attributes: [[fn('AVG', col('rating')), 'avgRating']],
        raw: true,
      });
      plain.rating = avg && avg.avgRating ? parseFloat(avg.avgRating).toFixed(1) : null;
    }

    res.json({ user: plain });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [likeOp]: `%${name}%` };
    if (email) where.email = { [likeOp]: `%${email}%` };
    if (address) where.address = { [likeOp]: `%${address}%` };

    const allowedSort = ['name', 'email', 'address', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({ where, order: [[sortField, sortOrder]] });

    const results = await Promise.all(
      stores.map(async (s) => {
        const avg = await Rating.findOne({
          where: { storeId: s.id },
          attributes: [[fn('AVG', col('rating')), 'avgRating']],
          raw: true,
        });
        return { ...s.toJSON(), rating: avg && avg.avgRating ? parseFloat(avg.avgRating).toFixed(1) : null };
      })
    );

    res.json({ stores: results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
