const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// GET /api/owner/dashboard
exports.dashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: 'No store is associated with this account' });

    const avg = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
      raw: true,
    });

    const raters = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      averageRating: avg && avg.avgRating ? parseFloat(avg.avgRating).toFixed(1) : null,
      raters: raters.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
