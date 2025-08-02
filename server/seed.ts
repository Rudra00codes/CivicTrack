import mongoose from 'mongoose';
import User from './src/models/User';
import Issue from './src/models/Issue';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Issue.deleteMany({});

    // Create demo users
    const user1 = new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      is_verified: true,
      role: 'citizen'
    });

    const user2 = new User({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: 'password123',
      is_verified: true,
      role: 'citizen'
    });

    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      is_verified: true,
      role: 'admin'
    });

    await user1.save();
    await user2.save();
    await admin.save();

    // Create demo issues
    const issues = [
      {
        title: 'Large Pothole on Main Street',
        description: 'There is a significant pothole on Main Street that is causing damage to vehicles. It needs immediate attention.',
        category: 'Roads',
        location: {
          type: 'Point',
          coordinates: [-0.1278, 51.5074] // London coordinates
        },
        user: user1._id,
        status: 'Reported',
        is_anonymous: false
      },
      {
        title: 'Broken Street Light',
        description: 'The street light at the corner of Oak Avenue has been out for over a week, making the area unsafe at night.',
        category: 'Lighting',
        location: {
          type: 'Point',
          coordinates: [-0.1276, 51.5076]
        },
        user: user2._id,
        status: 'In Progress',
        is_anonymous: false
      },
      {
        title: 'Water Leak in City Park',
        description: 'There is a water leak in the main water pipe at City Park, causing flooding in the walking path.',
        category: 'Water Supply',
        location: {
          type: 'Point',
          coordinates: [-0.1280, 51.5072]
        },
        user: user1._id,
        status: 'Reported',
        is_anonymous: false
      },
      {
        title: 'Overflowing Garbage Bin',
        description: 'The garbage bin near the bus stop is overflowing and needs immediate attention.',
        category: 'Cleanliness',
        location: {
          type: 'Point',
          coordinates: [-0.1275, 51.5075]
        },
        user: user2._id,
        status: 'Resolved',
        is_anonymous: true
      },
      {
        title: 'Damaged Safety Barrier',
        description: 'The safety barrier on the bridge is damaged and poses a risk to pedestrians.',
        category: 'Public Safety',
        location: {
          type: 'Point',
          coordinates: [-0.1282, 51.5078]
        },
        user: user1._id,
        status: 'Reported',
        is_anonymous: false
      }
    ];

    for (const issueData of issues) {
      const issue = new Issue(issueData);
      await issue.save();
    }

    console.log('Demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});
