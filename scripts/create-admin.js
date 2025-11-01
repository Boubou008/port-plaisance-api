require('dotenv').config();
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');

(async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@port.fr';
  const password = process.env.ADMIN_PASSWORD || 'Passw0rd!';
  const username = process.env.ADMIN_USERNAME || 'Capitaine';
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, username, passwordHash: '' });
  }
  await user.setPassword(password);
  await user.save();
  console.log('Admin prêt :', { email, password });
  process.exit(0);
})();
