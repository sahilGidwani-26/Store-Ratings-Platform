const { Op, fn, col } = require('sequelize');
const { Store, Rating, sequelize } = require('../models');

const likeOp = sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

// GET /api/stores?search=  -> list all stores, with overall rating + this user's rating
exports.listStores = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [{ name: { [likeOp]: `%${search}%` } }, { address: { [likeOp]: `%${search}%` } }];
    }

    const stores = await Store.findAll({ where, order: [['name', 'ASC']] });

    const results = await Promise.all(
      stores.map(async (s) => {
        const avg = await Rating.findOne({
          where: { storeId: s.id },
          attributes: [[fn('AVG', col('rating')), 'avgRating']],
          raw: true,
        });
        const userRating = await Rating.findOne({ where: { storeId: s.id, userId: req.user.id } });
        return {
          ...s.toJSON(),
          overallRating: avg && avg.avgRating ? parseFloat(avg.avgRating).toFixed(1) : null,
          userRating: userRating ? userRating.rating : null,
        };
      })
    );

    res.json({ stores: results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/stores/:id/ratings  -> submit new rating
exports.submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ where: { storeId, userId: req.user.id } });
    if (existing) return res.status(409).json({ message: 'You already rated this store. Use PUT to modify it.' });

    const newRating = await Rating.create({ storeId, userId: req.user.id, rating });
    res.status(201).json({ rating: newRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/stores/:id/ratings  -> modify existing rating
exports.updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing = await Rating.findOne({ where: { storeId, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'You have not rated this store yet' });

    existing.rating = rating;
    await existing.save();
    res.json({ rating: existing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
