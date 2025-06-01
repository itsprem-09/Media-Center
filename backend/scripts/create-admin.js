require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin user data
const adminData = {
  email: 'admin@mediacenter.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin'
};

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log(`Admin user already exists with email: ${adminData.email}`);
      process.exit(0);
    }
    
    // Create new admin user
    const admin = new User(adminData);
    await admin.save();
    
    console.log(`Admin user created successfully with email: ${adminData.email}`);
    console.log('Password: admin123');
    console.log('You can use these credentials to log in to the admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
