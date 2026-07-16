// Creates the default System Administrator account.
// Run with: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = process.env.ADMIN_EMAIL || 'admin@storeratings.com';
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 10);
    await User.create({
      name: process.env.ADMIN_NAME || 'System Administrator Account',
      email,
      password: hashed,
      address: process.env.ADMIN_ADDRESS || 'Head Office',
      role: 'admin',
    });

    console.log('Default admin created:');
    console.log('  email:', email);
    console.log('  password:', process.env.ADMIN_PASSWORD || 'Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

run();
